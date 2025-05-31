"use client";

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

export default function ScanPage() {
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
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: "environment", // Use back camera on mobile
					width: {ideal: 640},
					height: {ideal: 480},
				},
			});

			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				videoRef.current.play();
			}
		} catch (err) {
			console.error("Error accessing camera:", err);
			setError("Failed to access camera");
		}
	};

	const stopCamera = () => {
		if (videoRef.current && videoRef.current.srcObject) {
			const stream = videoRef.current.srcObject as MediaStream;
			stream.getTracks().forEach((track) => track.stop());
			videoRef.current.srcObject = null;
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

	const startScanning = async () => {
		if (!workerId || !inferEngine || !videoRef.current) {
			console.log("Cannot start scanning - missing requirements");
			return;
		}

		console.log("Starting scanning...");
		isScanningRef.current = true;
		setIsScanning(true);

		await startCamera();

		// Wait a bit for camera to initialize, then start detection
		setTimeout(() => {
			console.log("Starting detection loop...");
			detectFrame();
		}, 500);
	};

	const stopScanning = () => {
		console.log("Stopping scanning...");
		isScanningRef.current = false;
		setIsScanning(false);
		stopCamera();
		setPredictions([]);

		// Clear canvas
		if (canvasRef.current) {
			const ctx = canvasRef.current.getContext("2d");
			if (ctx) {
				ctx.clearRect(
					0,
					0,
					canvasRef.current.width,
					canvasRef.current.height
				);
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
			const className =
				prediction.class || prediction.className || "Unknown";
			const confidence = prediction.confidence || 0;

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
			<div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
				<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
					<svg
						className="w-8 h-8 text-red-600"
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
				<h3 className="text-lg font-semibold text-gray-900">Error</h3>
				<p className="text-sm text-gray-600 text-center">{error}</p>
				<button
					onClick={() => window.location.reload()}
					className="bg-primary text-white px-6 py-2 rounded-lg font-medium"
				>
					Retry
				</button>
			</div>
		);
	}

	return (
		<div className="space-y-6 pb-4">
			{/* Header */}
			<div className="text-center py-4">
				<h1 className="text-2xl font-bold text-gray-900 mb-2">
					Food Detection Scanner
				</h1>
				<p className="text-gray-600 text-sm">
					Arahkan kamera ke makanan untuk deteksi otomatis
				</p>
			</div>

			{/* Camera View */}
			<div className="bg-white rounded-xl p-4 border border-gray-100">
				<div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
					{isLoading ? (
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="text-center text-white">
								<div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
								<p className="text-sm">Loading AI Model...</p>
							</div>
						</div>
					) : (
						<>
							<video
								ref={videoRef}
								className="w-full h-full object-cover"
								playsInline
								muted
							/>
							<canvas
								ref={canvasRef}
								className="absolute inset-0 w-full h-full"
								style={{pointerEvents: "none"}}
							/>
							{!isScanning && (
								<div className="absolute inset-0 flex items-center justify-center bg-black/50">
									<div className="text-center text-white">
										<div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
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
										<p className="text-sm">
											Tap to start scanning
										</p>
									</div>
								</div>
							)}
						</>
					)}
				</div>

				{/* Controls */}
				<div className="flex justify-center mt-4 space-x-4">
					{!isScanning ? (
						<button
							onClick={startScanning}
							disabled={isLoading}
							className="bg-primary text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
									d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9 5a9 9 0 1118 0 9 9 0 01-18 0z"
								/>
							</svg>
							<span>Mulai Scan</span>
						</button>
					) : (
						<button
							onClick={stopScanning}
							className="bg-red-600 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2"
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
									d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 10h6v4H9z"
								/>
							</svg>
							<span>Stop Scan</span>
						</button>
					)}
				</div>
			</div>

			{/* Live Detection Status */}
			{isScanning && (
				<div className="bg-gradient-to-r from-third/10 to-primary/10 rounded-xl p-4 border border-third/20">
					<div className="flex items-center space-x-3">
						<div className="w-3 h-3 bg-third rounded-full animate-pulse"></div>
						<div className="flex-1">
							<h3 className="text-sm font-semibold text-gray-900">
								Live Food Detection Active
							</h3>
							<p className="text-xs text-gray-600">
								{predictions.length > 0
									? `Detecting ${
											predictions.length
									  } food item${
											predictions.length > 1 ? "s" : ""
									  }`
									: "Scanning for food items..."}
							</p>
						</div>
						<div className="text-right">
							<div className="text-lg font-bold text-third">
								{predictions.length}
							</div>
							<div className="text-xs text-gray-600">
								detected
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Simplified Results - just count */}
			{predictions.length > 0 && (
				<div className="bg-white rounded-xl p-4 border border-gray-100">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						Food Detection Results
					</h3>
					<div className="text-center py-4">
						<div className="text-3xl font-bold text-primary mb-2">
							{predictions.length}
						</div>
						<p className="text-gray-600">
							Food item{predictions.length > 1 ? "s" : ""}{" "}
							detected
						</p>
					</div>
				</div>
			)}

			{/* Instructions */}
			<div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
				<h3 className="text-sm font-semibold text-blue-900 mb-2">
					Tips Food Detection:
				</h3>
				<ul className="text-xs text-blue-800 space-y-1">
					<li>• Pastikan pencahayaan cukup terang</li>
					<li>• Arahkan kamera langsung ke makanan</li>
					<li>• Jaga jarak 20-30 cm dari makanan</li>
					<li>• Hindari gerakan yang terlalu cepat</li>
					<li>
						• Bounding box akan muncul otomatis saat makanan
						terdeteksi
					</li>
				</ul>
			</div>
		</div>
	);
}
