import {useEffect, useRef, useState} from "react";
import {InferenceEngine} from "inferencejs";

interface DetectionResult {
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	bbox?: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
	class?: string;
	className?: string;
	confidence?: number;
	color?: string;
}

export const useCameraDetection = () => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const isScanningRef = useRef(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isScanning, setIsScanning] = useState(false);
	const [predictions, setPredictions] = useState<DetectionResult[]>([]);
	const [workerId, setWorkerId] = useState<string | null>(null);
	const [inferEngine, setInferEngine] = useState<InferenceEngine | null>(
		null
	);
	const [error, setError] = useState<string | null>(null);
	const [cameraStarted, setCameraStarted] = useState(false);

	useEffect(() => {
		initializeModel();
	}, []);

	const initializeModel = async () => {
		try {
			// Dynamic import to avoid TypeScript issues
			const {InferenceEngine} = await import("inferencejs");
			const engine = new InferenceEngine();
			setInferEngine(engine);

			// Initialize the model
			const id = await engine.startWorker(
				"plane-meal-gkxko-iqkzp",
				"2",
				"rf_dPxNJC0rbBQ0q1sNaZmm1x5swyp1"
			);
			setWorkerId(id);
			setIsLoading(false);
			console.log("Model loaded successfully!");
		} catch (err) {
			console.error("Error initializing model:", err);
			setError("Failed to initialize AI model");
			setIsLoading(false);
		}
	};

	const detectFrame = async () => {
		if (
			!isScanningRef.current ||
			!videoRef.current ||
			!canvasRef.current ||
			!workerId ||
			!inferEngine
		) {
			console.log("Stopping detection loop - conditions not met");
			return;
		}

		try {
			const {CVImage} = await import("inferencejs");
			const image = new CVImage(videoRef.current);
			const results = await inferEngine.infer(workerId, image);

			setPredictions(results as DetectionResult[]);
			drawPredictions(results as DetectionResult[]);

			// Continue the detection loop if still scanning
			if (isScanningRef.current) {
				requestAnimationFrame(detectFrame);
			}
		} catch (err) {
			console.error("Inference error:", err);
			// Continue the loop even on error if still scanning
			if (isScanningRef.current) {
				requestAnimationFrame(detectFrame);
			}
		}
	};

	const drawPredictions = (predictions: DetectionResult[]) => {
		if (!canvasRef.current || !videoRef.current) return;

		const canvas = canvasRef.current;
		const video = videoRef.current;
		const ctx = canvas.getContext("2d");

		if (!ctx) return;

		// Set canvas size to match video
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;

		// Clear previous drawings
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Draw bounding boxes with enhanced styling
		predictions.forEach((prediction) => {
			// Handle both possible response formats
			const bbox = prediction.bbox || prediction;
			const x = bbox.x || prediction.x || 0;
			const y = bbox.y || prediction.y || 0;
			const width = bbox.width || prediction.width || 0;
			const height = bbox.height || prediction.height || 0;

			if (!x || !y || !width || !height) return; // Skip invalid predictions

			// Calculate box coordinates
			const boxX = x - width / 2;
			const boxY = y - height / 2;

			// Draw main bounding box
			if (prediction.class === "bread") {
				ctx.strokeStyle = "#FF0000";
			} else {
				ctx.strokeStyle = "#00FF00";
			}

			ctx.lineWidth = 4;
			ctx.setLineDash([]);
			ctx.strokeRect(boxX, boxY, width, height);

			// // Draw corner guides for better visibility
			// const cornerLength = 20;
			// ctx.strokeStyle = "#02b5ac";
			// ctx.lineWidth = 3;

			// // Top-left corner
			// ctx.beginPath();
			// ctx.moveTo(boxX, boxY + cornerLength);
			// ctx.lineTo(boxX, boxY);
			// ctx.lineTo(boxX + cornerLength, boxY);
			// ctx.stroke();

			// // Top-right corner
			// ctx.beginPath();
			// ctx.moveTo(boxX + width - cornerLength, boxY);
			// ctx.lineTo(boxX + width, boxY);
			// ctx.lineTo(boxX + width, boxY + cornerLength);
			// ctx.stroke();

			// // Bottom-left corner
			// ctx.beginPath();
			// ctx.moveTo(boxX, boxY + height - cornerLength);
			// ctx.lineTo(boxX, boxY + height);
			// ctx.lineTo(boxX + cornerLength, boxY + height);
			// ctx.stroke();

			// // Bottom-right corner
			// ctx.beginPath();
			// ctx.moveTo(boxX + width - cornerLength, boxY + height);
			// ctx.lineTo(boxX + width, boxY + height);
			// ctx.lineTo(boxX + width, boxY + height - cornerLength);
			// ctx.stroke();

			// // Draw center crosshair
			// ctx.strokeStyle = "#d2dd25";
			// ctx.lineWidth = 2;
			// ctx.setLineDash([5, 5]);

			// // Horizontal line
			// ctx.beginPath();
			// ctx.moveTo(x - 15, y);
			// ctx.lineTo(x + 15, y);
			// ctx.stroke();

			// // Vertical line
			// ctx.beginPath();
			// ctx.moveTo(x, y - 15);
			// ctx.lineTo(x, y + 15);
			// ctx.stroke();

			// Reset line dash
			ctx.setLineDash([]);
		});
	};

	const startCamera = async () => {
		try {
			console.log("Requesting camera access...");

			if (
				!navigator.mediaDevices ||
				!navigator.mediaDevices.getUserMedia
			) {
				throw new Error("Camera not supported in this browser");
			}

			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: "environment",
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
							console.log("Video playing successfully");
							// Automatically start scanning after camera is ready
							setTimeout(() => {
								if (workerId && inferEngine) {
									console.log("Auto-starting scanning...");
									isScanningRef.current = true;
									setIsScanning(true);
									detectFrame();
								}
							}, 500);
						})
						.catch((playError) => {
							console.log(
								"Video play failed, but continuing:",
								playError
							);
							// Even if play fails, try to start scanning
							setTimeout(() => {
								if (workerId && inferEngine) {
									console.log(
										"Auto-starting scanning (after play failed)..."
									);
									isScanningRef.current = true;
									setIsScanning(true);
									detectFrame();
								}
							}, 500);
						});
				} else {
					console.error("Video ref still null after state update");
				}
			}, 100); // Small delay to allow re-render
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
			// Also stop scanning when camera is stopped
			isScanningRef.current = false;
			setIsScanning(false);
			setPredictions([]);
		}
	};

	useEffect(() => {
		return () => {
			console.log("Component unmounting, stopping scanning...");
			isScanningRef.current = false;
			stopCamera();
		};
	}, []);

	return {
		videoRef,
		canvasRef,
		isLoading,
		isScanning,
		predictions,
		error,
		cameraStarted,
		startCamera,
		stopCamera,
	};
};
