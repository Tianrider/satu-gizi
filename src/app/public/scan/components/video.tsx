"use client";
import {useEffect, useRef, useState} from "react";
import {usePoseNet} from "@/utils/posenet/use-posenet";
import {draw} from "@/utils/posenet/use-canvas";
import {Camera, CameraOff, Pause, Play, CheckCircle} from "lucide-react";
import cn from "classnames";

export default function VideoCanvas() {
	const [webcamEnabled, setWebcamEnabled] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [videoSize, setVideoSize] = useState({width: 0, height: 0});
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const poses = usePoseNet(
		webcamEnabled && !isPaused ? videoRef.current : null
	);
	const [prediction] = useState<{
		message: string;
		probability: number;
	}>({message: "-", probability: 0});

	// Calculate responsive video dimensions without fixed aspect ratio
	useEffect(() => {
		const updateSize = () => {
			// Use viewport dimensions for mobile responsiveness
			const maxWidth = Math.min(window.innerWidth - 32, 700); // 16px padding on each side
			const maxHeight = Math.min(window.innerHeight - 200, 500); // Leave space for header and buttons

			// Let the camera determine its own aspect ratio
			// We'll update these dimensions once we get the actual video stream
			setVideoSize({width: maxWidth, height: maxHeight});
		};

		updateSize();
		window.addEventListener("resize", updateSize);
		return () => window.removeEventListener("resize", updateSize);
	}, []);

	// Update video size based on actual camera stream
	useEffect(() => {
		if (videoRef.current && webcamEnabled && !isLoading) {
			const video = videoRef.current;

			const updateVideoSize = () => {
				if (video.videoWidth && video.videoHeight) {
					// Get the camera's natural aspect ratio
					const cameraAspectRatio =
						video.videoWidth / video.videoHeight;

					// Calculate responsive dimensions maintaining camera's aspect ratio
					const maxWidth = Math.min(window.innerWidth - 32, 700);
					const maxHeight = Math.min(window.innerHeight - 200, 500);

					let width = maxWidth;
					let height = width / cameraAspectRatio;

					// If height exceeds max, scale down
					if (height > maxHeight) {
						height = maxHeight;
						width = height * cameraAspectRatio;
					}

					console.log("Camera aspect ratio:", cameraAspectRatio);
					console.log("Video size updated:", {width, height});

					setVideoSize({width, height});
				}
			};

			// Listen for video metadata loaded
			video.addEventListener("loadedmetadata", updateVideoSize);

			// Initial update
			updateVideoSize();

			return () => {
				video.removeEventListener("loadedmetadata", updateVideoSize);
			};
		}
	}, [webcamEnabled, isLoading]);

	// Enable/disable webcam
	useEffect(() => {
		if (webcamEnabled) {
			setIsLoading(true);
			enableWebcam();
		} else {
			if (videoRef.current && videoRef.current.srcObject) {
				const stream = videoRef.current.srcObject as MediaStream;
				stream.getTracks().forEach((track) => track.stop());
				videoRef.current.srcObject = null;
			}
		}
	}, [webcamEnabled]);

	// Process poses and update predictions
	useEffect(() => {
		// Use the draw function from useCanvas utility with proper scaling
		if (canvasRef.current && videoRef.current && poses) {
			const canvas = canvasRef.current;
			const video = videoRef.current;

			// Calculate scaling factors between native video size and displayed size
			const scaleX = 1;
			const scaleY = 1;

			console.log("Drawing with scale factors:", {scaleX, scaleY});

			// Clear canvas
			const ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				// Apply scaling for pose drawing
				ctx.save();
				ctx.scale(scaleX, scaleY);

				// Draw poses using the utility function
				draw(canvas, video, poses);

				ctx.restore();
			}
		}
	}, [poses, videoSize]);

	const enableWebcam = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: "environment",
				},
				audio: false,
			});

			if (videoRef.current) {
				videoRef.current.srcObject = stream;

				// Add event listener for when video is ready
				videoRef.current.onloadeddata = () => {
					setIsLoading(false);
				};
			}
		} catch (error) {
			console.error("Error accessing webcam:", error);
			setWebcamEnabled(false);
			setIsLoading(false);
		}
	};

	const togglePause = () => {
		setIsPaused(!isPaused);

		if (videoRef.current) {
			if (isPaused) {
				videoRef.current.play();
			} else {
				videoRef.current.pause();
			}
		}
	};

	const handleFinish = () => {
		// Pause the session
		if (!isPaused) {
			setIsPaused(true);
			if (videoRef.current) {
				videoRef.current.pause();
			}
		}
	};

	return (
		<div className="flex flex-col items-center p-4 min-h-screen pt-32">
			<div className="relative w-full max-w-2xl">
				{!webcamEnabled ? (
					<div
						className="bg-gray-800 rounded-lg shadow-lg flex flex-col items-center justify-center mx-auto"
						style={{
							width: videoSize.width,
							height: videoSize.height,
						}}
					>
						<Camera className="h-16 w-16 text-gray-400 mb-4" />
						<p className="text-gray-300 text-lg text-center px-4">
							Camera is turned off
						</p>
						<p className="text-gray-400 text-sm mt-2 text-center px-4">
							Click the button below to enable your camera
						</p>
					</div>
				) : isLoading ? (
					<div
						className="bg-gray-800 rounded-lg shadow-lg flex flex-col items-center justify-center mx-auto"
						style={{
							width: videoSize.width,
							height: videoSize.height,
						}}
					>
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
						<p className="text-gray-300 text-lg text-center px-4">
							Initializing camera...
						</p>
						<p className="text-gray-400 text-sm mt-2 text-center px-4">
							Setting up pose detection
						</p>
					</div>
				) : null}

				<video
					ref={videoRef}
					width={videoSize.width}
					height={videoSize.height}
					autoPlay
					playsInline
					className="rounded-lg mx-auto block"
					style={{
						display: webcamEnabled && !isLoading ? "block" : "none",
					}}
				/>

				<canvas
					ref={canvasRef}
					width={videoSize.width}
					height={videoSize.height}
					className="top-0 left-0 rounded-lg pointer-events-none absolute"
					style={{
						display: webcamEnabled && !isLoading ? "block" : "none",
						transform: "scaleX(-1)", // Mirror to match video
					}}
				/>

				{/* Control Buttons */}
				<div className="mt-6 flex flex-wrap justify-center gap-3 px-4">
					<button
						onClick={() => setWebcamEnabled(!webcamEnabled)}
						className={cn(
							"px-4 py-3 bg-primary text-white rounded-lg flex items-center justify-center font-medium text-sm transition-all min-w-[140px]",
							isLoading
								? "opacity-50 cursor-not-allowed"
								: "hover:bg-primary/90"
						)}
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<div className="animate-spin mr-2 h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
								Loading...
							</>
						) : webcamEnabled ? (
							<>
								<CameraOff className="h-5 w-5 mr-2" />
								Turn Off Camera
							</>
						) : (
							<>
								<Camera className="h-5 w-5 mr-2" />
								Turn On Camera
							</>
						)}
					</button>

					{webcamEnabled && !isLoading && (
						<>
							<button
								onClick={togglePause}
								className="px-4 py-3 bg-gray-600 text-white rounded-lg flex items-center justify-center font-medium text-sm hover:bg-gray-700 transition-all min-w-[100px]"
							>
								{isPaused ? (
									<>
										<Play className="h-5 w-5 mr-2" />
										Resume
									</>
								) : (
									<>
										<Pause className="h-5 w-5 mr-2" />
										Pause
									</>
								)}
							</button>
							<button
								onClick={handleFinish}
								className="px-4 py-3 bg-green-600 text-white rounded-lg flex items-center justify-center font-medium text-sm hover:bg-green-700 transition-all min-w-[100px]"
							>
								<CheckCircle className="h-5 w-5 mr-2" />
								Finish
							</button>
						</>
					)}
				</div>

				{/* Prediction Display */}
				{webcamEnabled && !isLoading && (
					<div
						className={cn(
							"mt-4 mx-4 bg-opacity-80 text-white px-4 py-3 rounded-lg text-center",
							isPaused ? "bg-red-900" : "bg-black"
						)}
					>
						{isPaused ? (
							<div className="text-lg font-bold">PAUSED</div>
						) : (
							<>
								<div className="text-lg font-bold">
									{prediction.message === "-"
										? "Waiting for pose..."
										: prediction.message}
								</div>
								<div className="text-sm">
									Confidence:{" "}
									{Math.round(prediction.probability * 100)}%
								</div>
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
