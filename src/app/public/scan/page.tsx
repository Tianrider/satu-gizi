"use client";
import {useEffect, useRef, useState} from "react";
import {InferenceEngine} from "inferencejs";
import {useRouter} from "next/navigation";
import {ArrowLeft} from "lucide-react";

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

export default function ScanPage() {
	const router = useRouter();
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
		// Keep manual camera activation
	}, []);

	const initializeModel = async () => {
		try {
			// Dynamic import to avoid TypeScript issues
			const {InferenceEngine} = await import("inferencejs");
			const engine = new InferenceEngine();
			setInferEngine(engine);

			// Initialize the model
			const id = await engine.startWorker(
				"plane-meal-gkxko",
				"3",
				"rf_rik26UMGykbgfVzjMYYEaxHLCdK2"
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

	// Detection loop function that uses ref for scanning state
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

			// console.log("Detection results:", results);

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
			ctx.strokeStyle = prediction.color || "#d50b8b";
			ctx.lineWidth = 4;
			ctx.setLineDash([]);
			ctx.strokeRect(boxX, boxY, width, height);

			// Draw corner guides for better visibility
			const cornerLength = 20;
			ctx.strokeStyle = "#02b5ac";
			ctx.lineWidth = 3;

			// Top-left corner
			ctx.beginPath();
			ctx.moveTo(boxX, boxY + cornerLength);
			ctx.lineTo(boxX, boxY);
			ctx.lineTo(boxX + cornerLength, boxY);
			ctx.stroke();

			// Top-right corner
			ctx.beginPath();
			ctx.moveTo(boxX + width - cornerLength, boxY);
			ctx.lineTo(boxX + width, boxY);
			ctx.lineTo(boxX + width, boxY + cornerLength);
			ctx.stroke();

			// Bottom-left corner
			ctx.beginPath();
			ctx.moveTo(boxX, boxY + height - cornerLength);
			ctx.lineTo(boxX, boxY + height);
			ctx.lineTo(boxX + cornerLength, boxY + height);
			ctx.stroke();

			// Bottom-right corner
			ctx.beginPath();
			ctx.moveTo(boxX + width - cornerLength, boxY + height);
			ctx.lineTo(boxX + width, boxY + height);
			ctx.lineTo(boxX + width, boxY + height - cornerLength);
			ctx.stroke();

			// Draw center crosshair
			ctx.strokeStyle = "#d2dd25";
			ctx.lineWidth = 2;
			ctx.setLineDash([5, 5]);

			// Horizontal line
			ctx.beginPath();
			ctx.moveTo(x - 15, y);
			ctx.lineTo(x + 15, y);
			ctx.stroke();

			// Vertical line
			ctx.beginPath();
			ctx.moveTo(x, y - 15);
			ctx.lineTo(x, y + 15);
			ctx.stroke();

			// Reset line dash
			ctx.setLineDash([]);

			// Draw simple "Food" label without confidence
			const labelText = "Food";
			const labelPadding = 6;
			const labelHeight = 24;

			// Measure text width
			ctx.font = "bold 12px sans-serif";
			const textWidth = ctx.measureText(labelText).width;
			const labelWidth = textWidth + labelPadding * 2;

			// Position label above the box, or below if not enough space
			const labelY =
				boxY > labelHeight + 5 ? boxY - 5 : boxY + height + labelHeight;

			// Draw label background
			ctx.fillStyle = prediction.color || "#d50b8b";
			ctx.fillRect(boxX, labelY - labelHeight, labelWidth, labelHeight);

			// Draw label text
			ctx.fillStyle = "#ffffff";
			ctx.textBaseline = "middle";
			ctx.fillText(
				labelText,
				boxX + labelPadding,
				labelY - labelHeight / 2
			);
		});
	};

	useEffect(() => {
		return () => {
			console.log("Component unmounting, stopping scanning...");
			isScanningRef.current = false;
			stopCamera();
		};
	}, []);

	if (error) {
		return (
			<div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
				<div className="text-center">
					<div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg
							className="w-8 h-8"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
							/>
						</svg>
					</div>
					<h3 className="text-lg font-semibold mb-2">Camera Error</h3>
					<p className="text-sm text-gray-300 mb-4">{error}</p>
					<button
						onClick={() => window.location.reload()}
						className="bg-primary text-white px-6 py-2 rounded-lg font-medium"
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	// Debug logging
	console.log("State check:", {isLoading, cameraStarted, workerId});

	return (
		<div className="min-h-screen absolute bg-black w-full h-full top-o left-0 overflow-hidden">
			<>
				{/* Header */}
				<div className="absolute top-0 left-0 right-0 z-20 h-14 items-center flex px-4 bg-white">
					<div className="flex items-center">
						<button
							onClick={() => router.back()}
							className="flex items-center space-x-2 text-primary font-bold"
						>
							<ArrowLeft size={20} />
							<span className="font-bold">Home</span>
						</button>
					</div>
				</div>

				{/* Tab Navigation */}
				<div className="absolute top-16 left-4 right-4 z-20">
					<div className="flex bg-white/20 backdrop-blur-sm rounded-xl p-1">
						<button className="flex-1 bg-primary text-white py-3 px-4 rounded-lg text-sm font-medium flex items-center justify-center space-x-2">
							<svg
								className="w-5 h-5"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
								<path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
							<span>Scan Makanan</span>
						</button>
						<button className="flex-1 text-white py-3 px-4 rounded-lg text-sm font-medium flex items-center justify-center space-x-2">
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
								/>
							</svg>
							<span>Cek Stunting</span>
						</button>
					</div>
				</div>
			</>
			{/* Show Turn on Camera Button when model is loaded but camera not started */}
			{!isLoading && !cameraStarted ? (
				<div className="absolute inset-0 flex items-center justify-center h-full bg-black">
					<div className="text-center text-white">
						<div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
							<svg
								className="w-8 h-8"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
						</div>
						<h3 className="text-lg font-semibold mb-2">
							Ready to Scan
						</h3>
						<p className="text-sm text-gray-300 mb-6">
							AI Model loaded successfully
						</p>
						<button
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								console.log("Button clicked!");
								startCamera();
							}}
							className="bg-primary text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2 mx-auto relative z-10 cursor-pointer hover:bg-primary/90 transition-colors"
							style={{pointerEvents: "auto"}}
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
								/>
							</svg>
							<span>Turn On Camera</span>
						</button>
					</div>
				</div>
			) : (
				<>
					{/* Full Screen Camera */}
					<div className="absolute inset-0 w-full h-full">
						{/* Always render video element for ref access */}
						<video
							ref={videoRef}
							className={`w-full h-full object-cover ${
								cameraStarted ? "block" : "hidden"
							}`}
							playsInline
							autoPlay
							muted
							style={{display: cameraStarted ? "block" : "none"}}
						/>
						{isLoading ? (
							<div className="flex items-center justify-center h-full bg-black">
								<div className="text-center text-white">
									<div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
									<p className="text-sm">
										Loading AI Model...
									</p>
								</div>
							</div>
						) : (
							<>
								<canvas
									ref={canvasRef}
									className={`absolute inset-0 w-full h-full ${
										cameraStarted ? "block" : "hidden"
									}`}
									style={{pointerEvents: "none"}}
								/>
							</>
						)}
					</div>

					{/* Instruction Text - only show when camera is active */}
					{cameraStarted && (
						<div className="absolute top-36 left-4 right-4 z-20">
							<div className="text-center text-white">
								<p className="text-sm bg-black/40 backdrop-blur-sm rounded-lg px-4 py-3 leading-relaxed">
									AI sedang memindai makanan secara otomatis
								</p>
							</div>
						</div>
					)}
				</>
			)}
		</div>
	);
}
