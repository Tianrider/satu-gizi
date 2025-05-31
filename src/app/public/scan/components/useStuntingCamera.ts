import {useEffect, useRef, useState, useMemo} from "react";
import {usePoseNet} from "@/utils/posenet/use-posenet";
import {drawKeypoints, drawSkeleton} from "@/utils/posenet/use-helper";

export const useStuntingCamera = () => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [error, setError] = useState<string | null>(null);
	const [cameraStarted, setCameraStarted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [videoReady, setVideoReady] = useState(false);

	// Use PoseNet hook - only when camera is started AND video has proper dimensions
	const videoElementForPoseNet = useMemo(() => {
		const video = videoRef.current;
		const isValid =
			cameraStarted &&
			videoReady &&
			video &&
			video.videoWidth > 0 &&
			video.videoHeight > 0 &&
			video.readyState >= 2; // HAVE_CURRENT_DATA or higher

		console.log("Video validation for PoseNet:", {
			cameraStarted,
			videoReady,
			hasVideo: !!video,
			videoWidth: video?.videoWidth,
			videoHeight: video?.videoHeight,
			readyState: video?.readyState,
			isValid,
		});

		return isValid ? video : null;
	}, [cameraStarted, videoReady]);

	const poses = usePoseNet(videoElementForPoseNet);

	// Process poses and draw them on canvas
	useEffect(() => {
		console.log("Pose detection effect:", {
			posesLength: poses?.length || 0,
			cameraStarted,
			videoReady,
			isLoading,
			videoReadyState: videoRef.current?.readyState,
			canvasReady: !!canvasRef.current,
			videoWidth: videoRef.current?.videoWidth,
			videoHeight: videoRef.current?.videoHeight,
			videoElementForPoseNet: !!videoElementForPoseNet,
		});

		if (
			poses &&
			poses.length > 0 &&
			cameraStarted &&
			canvasRef.current &&
			videoRef.current
		) {
			const canvas = canvasRef.current;
			const video = videoRef.current;
			const ctx = canvas.getContext("2d");

			console.log("Canvas debugging:", {
				canvas: !!canvas,
				video: !!video,
				ctx: !!ctx,
				canvasWidth: canvas?.width,
				canvasHeight: canvas?.height,
				canvasStyle: canvas?.style.cssText,
				canvasDisplay: getComputedStyle(canvas).display,
				canvasVisibility: getComputedStyle(canvas).visibility,
				canvasOpacity: getComputedStyle(canvas).opacity,
			});

			if (!ctx) {
				console.error("Canvas context is null!");
				return;
			}

			console.log("Drawing poses:", poses.length);
			console.log(
				"Video dimensions:",
				video.videoWidth,
				"x",
				video.videoHeight
			);
			console.log(
				"Canvas current size:",
				canvas.width,
				"x",
				canvas.height
			);

			// Wait for video to have proper dimensions
			if (video.videoWidth === 0 || video.videoHeight === 0) {
				console.log("Video dimensions not ready yet");
				return;
			}

			// Get the display dimensions of the canvas
			const canvasRect = canvas.getBoundingClientRect();
			const displayWidth = canvasRect.width;
			const displayHeight = canvasRect.height;

			// Set canvas internal dimensions to match display size
			canvas.width = displayWidth;
			canvas.height = displayHeight;

			console.log(
				"Canvas size set to:",
				canvas.width,
				"x",
				canvas.height
			);
			console.log("Display size:", displayWidth, "x", displayHeight);

			// Additional debugging after setting dimensions
			console.log("Canvas after dimension setting:", {
				width: canvas.width,
				height: canvas.height,
				clientWidth: canvas.clientWidth,
				clientHeight: canvas.clientHeight,
				offsetWidth: canvas.offsetWidth,
				offsetHeight: canvas.offsetHeight,
				getBoundingClientRect: canvas.getBoundingClientRect(),
			});

			// Calculate scaling factors
			const scaleX = displayWidth / video.videoWidth;
			const scaleY = displayHeight / video.videoHeight;
			// Use uniform scaling for helper functions (use smaller scale to maintain aspect ratio)
			const scale = Math.min(scaleX, scaleY);

			console.log("Scale factors:", {scaleX, scaleY, scale});

			// Clear canvas
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Force canvas background to be visible
			ctx.fillStyle = "rgba(255, 0, 0, 0.3)"; // Semi-transparent red background
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Draw simple test elements
			ctx.fillStyle = "#00ff00"; // Bright green
			ctx.fillRect(50, 50, 100, 100); // Green square

			ctx.strokeStyle = "#0000ff"; // Bright blue
			ctx.lineWidth = 5;
			ctx.strokeRect(200, 50, 100, 100); // Blue outline square

			ctx.fillStyle = "#ffffff"; // White text
			ctx.font = "20px Arial";
			ctx.fillText("TEST CANVAS", 50, 200);

			console.log("Canvas test elements drawn");

			// Draw poses using helper functions
			poses.forEach((pose, poseIndex) => {
				console.log(
					`Drawing pose ${poseIndex} with score: ${pose.score}`
				);

				if (pose.score >= 0.3) {
					console.log("About to call helper functions...");

					// Draw keypoints using helper function
					drawKeypoints(pose.keypoints, 0.3, ctx, scale);

					// Draw skeleton using helper function
					drawSkeleton(pose.keypoints, 0.3, ctx, scale);

					console.log("Helper functions called");
				}
			});

			console.log("Finished drawing poses using helper functions");
		}

		// Turn off loading once we get first pose detection
		if (poses && poses.length > 0 && isLoading) {
			console.log("Poses detected, turning off loading");
			setIsLoading(false);
		}
	}, [poses, cameraStarted, videoReady, isLoading, videoElementForPoseNet]);

	// Add a fallback timeout to turn off loading after 5 seconds
	useEffect(() => {
		if (isLoading && cameraStarted) {
			console.log("Setting fallback timeout for loading");
			const timeout = setTimeout(() => {
				console.log("Fallback timeout reached, turning off loading");
				setIsLoading(false);
			}, 5000); // 5 seconds timeout (reduced from 10)

			return () => clearTimeout(timeout);
		}
	}, [isLoading, cameraStarted]);

	// Additional timeout from when camera starts to ensure loading doesn't get stuck
	useEffect(() => {
		if (cameraStarted && isLoading) {
			const emergencyTimeout = setTimeout(() => {
				console.log("Emergency timeout: forcing loading off");
				setIsLoading(false);
			}, 8000); // 8 seconds from camera start

			return () => clearTimeout(emergencyTimeout);
		}
	}, [cameraStarted, isLoading]);

	const startCamera = async () => {
		try {
			console.log("Requesting camera access for stunting check...");
			setIsLoading(true);

			if (
				!navigator.mediaDevices ||
				!navigator.mediaDevices.getUserMedia
			) {
				throw new Error("Camera not supported in this browser");
			}

			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: "environment", // Back camera for stunting check
					width: {ideal: 1280, min: 640},
					height: {ideal: 720, min: 480},
				},
			});

			console.log("Camera stream obtained:", stream);

			// Set camera started first to make video element visible
			setCameraStarted(true);

			// Use setTimeout to ensure state update and re-render happens
			setTimeout(() => {
				console.log("videoRef.current", videoRef.current);
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
					console.log("Stream assigned to video element");

					// Add event listeners for video state
					videoRef.current.onloadedmetadata = () => {
						console.log("Video metadata loaded");
						// Check if video has proper dimensions with a small delay
						setTimeout(() => {
							if (
								videoRef.current &&
								videoRef.current.videoWidth > 0 &&
								videoRef.current.videoHeight > 0
							) {
								console.log(
									"Video dimensions are ready:",
									videoRef.current.videoWidth,
									"x",
									videoRef.current.videoHeight
								);
								setVideoReady(true);
							}
						}, 500); // 500ms delay to ensure dimensions are stable
					};

					videoRef.current.onloadeddata = () => {
						console.log("Video data loaded");
						// Double-check dimensions here too with delay
						setTimeout(() => {
							if (
								videoRef.current &&
								videoRef.current.videoWidth > 0 &&
								videoRef.current.videoHeight > 0
							) {
								console.log(
									"Video dimensions confirmed in onloadeddata"
								);
								setVideoReady(true);
							}
						}, 500);
					};

					videoRef.current.oncanplay = () => {
						console.log("Video can start playing");
						// Final check for dimensions with delay
						setTimeout(() => {
							if (
								videoRef.current &&
								videoRef.current.videoWidth > 0 &&
								videoRef.current.videoHeight > 0
							) {
								console.log(
									"Video dimensions confirmed in oncanplay"
								);
								setVideoReady(true);
							}
						}, 500);
					};

					// Try to play the video
					videoRef.current
						.play()
						.then(() => {
							console.log("Stunting camera playing successfully");
							console.log("Video dimensions:", {
								videoWidth: videoRef.current?.videoWidth,
								videoHeight: videoRef.current?.videoHeight,
							});
						})
						.catch((playError) => {
							console.log(
								"Video play failed, but continuing:",
								playError
							);
							// Still allow loading to complete even if video play fails
							setTimeout(() => {
								console.log(
									"Setting loading to false after play error"
								);
								setIsLoading(false);
							}, 3000);
						});
				} else {
					console.error("Video ref still null after state update");
					setIsLoading(false);
				}
			}, 100);
		} catch (err) {
			console.error("Error accessing camera:", err);
			setError(
				`Camera access failed: ${
					err instanceof Error ? err.message : "Unknown error"
				}`
			);
			setIsLoading(false);
		}
	};

	const stopCamera = () => {
		if (videoRef.current && videoRef.current.srcObject) {
			const stream = videoRef.current.srcObject as MediaStream;
			stream.getTracks().forEach((track) => track.stop());
			videoRef.current.srcObject = null;
			setCameraStarted(false);
			setIsLoading(false);
			setVideoReady(false);
		}
	};

	useEffect(() => {
		return () => {
			console.log("Stunting camera component unmounting...");
			stopCamera();
		};
	}, []);

	return {
		videoRef,
		canvasRef,
		error,
		cameraStarted,
		isLoading,
		poses,
		startCamera,
		stopCamera,
	};
};
