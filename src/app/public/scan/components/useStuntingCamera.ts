import {useEffect, useRef, useState} from "react";

export const useStuntingCamera = () => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [error, setError] = useState<string | null>(null);
	const [cameraStarted, setCameraStarted] = useState(false);

	const startCamera = async () => {
		try {
			console.log("Requesting camera access for stunting check...");

			if (
				!navigator.mediaDevices ||
				!navigator.mediaDevices.getUserMedia
			) {
				throw new Error("Camera not supported in this browser");
			}

			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: "user", // Front camera for stunting check
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

					// Try to play the video
					videoRef.current
						.play()
						.then(() => {
							console.log("Stunting camera playing successfully");
						})
						.catch((playError) => {
							console.log(
								"Video play failed, but continuing:",
								playError
							);
						});
				} else {
					console.error("Video ref still null after state update");
				}
			}, 100);
		} catch (err) {
			console.error("Error accessing camera:", err);
			setError(
				`Camera access failed: ${
					err instanceof Error ? err.message : "Unknown error"
				}`
			);
		}
	};

	const stopCamera = () => {
		if (videoRef.current && videoRef.current.srcObject) {
			const stream = videoRef.current.srcObject as MediaStream;
			stream.getTracks().forEach((track) => track.stop());
			videoRef.current.srcObject = null;
			setCameraStarted(false);
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
		error,
		cameraStarted,
		startCamera,
		stopCamera,
	};
};
