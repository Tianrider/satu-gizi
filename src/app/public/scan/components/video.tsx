"use client";
import {useEffect, useRef, useState} from "react";
import {usePoseNet} from "@/utils/posenet/use-posenet";
import {draw, predict} from "@/utils/posenet/use-canvas";
import {
	Camera,
	CameraOff,
	Pause,
	Play,
	CheckCircle,
	RotateCcw,
} from "lucide-react";
import cn from "classnames";
import {
	sendImageChatCompletion,
	compressBase64Image,
	sendTextChatCompletion,
} from "@/utils/azure-openai";
import {useRouter} from "next/navigation";
import Image from "next/image";

const SYSTEM_PROMPT = `You are a medical AI assistant specialized in pediatric nutrition and growth assessment.\nGiven a single image of a standing person (child or adolescent), your task is to estimate the following attributes as accurately as possible based on visible body proportions, posture, and any contextual clues:\n\n- Height (in centimeters)\n- Weight (in kilograms)\n- Age (in years)\n\nInstructions:\n- Assume the person is standing upright, with their full body visible.\n- Use visual cues such as body proportions, limb length, head-to-body ratio, and any other relevant features to make your estimates.\n- If the image quality or pose makes estimation difficult, provide your best guess and note any uncertainty.\n- Output your results in the following JSON format:\n\n'{\n  "height_cm": <number>,\n  "weight_kg": <number>,\n  "age_years": <number>,\n  "confidence": "<low|medium|high>",\n  "notes": "<brief explanation of reasoning or uncertainty>"\n}'\n`;

// Loading overlay component
const LoadingOverlay = () => (
	<div className="fixed inset-0 bg-gradient-to-b from-teal-100 to-teal-600 flex flex-col items-center justify-center z-50">
		{/* Meditation person icon */}
		<div className="mb-8">
			<Image
				src="/stunting-scan.png"
				alt="Loading"
				width={100}
				height={100}
			/>
		</div>

		{/* Loading text */}
		<div className="text-center px-8">
			<p className="text-white text-lg font-medium">
				Sedang memproses hasil analisis pertumbuhan...
			</p>
		</div>

		{/* Animated dots */}
		<div className="flex space-x-1 mt-4">
			<div
				className="w-2 h-2 bg-white rounded-full animate-bounce"
				style={{animationDelay: "0ms"}}
			></div>
			<div
				className="w-2 h-2 bg-white rounded-full animate-bounce"
				style={{animationDelay: "150ms"}}
			></div>
			<div
				className="w-2 h-2 bg-white rounded-full animate-bounce"
				style={{animationDelay: "300ms"}}
			></div>
		</div>
	</div>
);

export default function VideoCanvas() {
	const [webcamEnabled, setWebcamEnabled] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [videoSize, setVideoSize] = useState({width: 0, height: 0});
	const [isFrozen, setIsFrozen] = useState(false);
	const [countdown, setCountdown] = useState<number | null>(null);
	const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isAIPending, setIsAIPending] = useState(false);
	const [aiResult, setAiResult] = useState<null | {
		height_cm: number;
		weight_kg: number;
		age_years: number;
		confidence: string;
		notes: string;
	}>(null);
	const [editFields, setEditFields] = useState<{
		height_cm: string;
		weight_kg: string;
		age_years: string;
	} | null>(null);
	const [stuntingResult, setStuntingResult] = useState<string | null>(null);
	const router = useRouter();

	const poses = usePoseNet(
		webcamEnabled && !isPaused && !isFrozen ? videoRef.current : null
	);
	const [prediction, setPrediction] = useState<{
		message: string;
		probability: number;
		isFullyVisible: boolean;
		missingParts: string[];
		isStanding: boolean;
	}>({
		message: "-",
		probability: 0,
		isFullyVisible: false,
		missingParts: [],
		isStanding: false,
	});

	// Countdown and freeze logic
	useEffect(() => {
		if (isFrozen) return; // Do nothing if frozen
		if (
			prediction.probability >= 0.9 &&
			prediction.isFullyVisible &&
			prediction.isStanding
		) {
			if (countdown === null) {
				setCountdown(3);
				if (countdownTimerRef.current)
					clearInterval(countdownTimerRef.current);
				countdownTimerRef.current = setInterval(() => {
					setCountdown((prev) => {
						if (prev === null) return null;
						if (prev <= 1) {
							clearInterval(countdownTimerRef.current!);
							setIsFrozen(true);
							return 0;
						}
						return prev - 1;
					});
				}, 1000);
			}
		} else {
			if (countdown !== null) setCountdown(null);
			if (countdownTimerRef.current) {
				clearInterval(countdownTimerRef.current);
				countdownTimerRef.current = null;
			}
			if (isFrozen) setIsFrozen(false);
		}
		return () => {
			if (
				countdownTimerRef.current &&
				(prediction.probability < 0.9 ||
					!prediction.isFullyVisible ||
					!prediction.isStanding)
			) {
				clearInterval(countdownTimerRef.current);
				countdownTimerRef.current = null;
			}
		};
	}, [prediction, countdown, isFrozen]);

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
		if (isFrozen) return; // Don't update canvas if frozen
		if (canvasRef.current && videoRef.current && poses) {
			const canvas = canvasRef.current;
			const video = videoRef.current;
			const scaleX = 1;
			const scaleY = 1;
			console.log("Drawing with scale factors:", {scaleX, scaleY});
			const ctx = canvas.getContext("2d");
			if (ctx) {
				draw(canvas, video, poses, videoSize.width, videoSize.height);
			}
			const analysis = predict(poses);
			setPrediction(analysis);
		} else {
			setPrediction({
				message: "Waiting for pose...",
				probability: 0,
				isFullyVisible: false,
				missingParts: [],
				isStanding: false,
			});
		}
	}, [poses, videoSize, isFrozen]);

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

	// Add a button to unfreeze/reset
	const handleUnfreeze = () => {
		setIsFrozen(false);
		setCountdown(null);
	};

	async function handleContinue() {
		if (!canvasRef.current) return;
		setIsAIPending(true);
		try {
			const canvas = canvasRef.current;
			const dataUrl = canvas.toDataURL("image/png");
			const compressedBase64 = await compressBase64Image(
				dataUrl.split(",")[1]
			);
			const result = await sendImageChatCompletion(
				SYSTEM_PROMPT,
				compressedBase64
			);
			console.log("OpenAI result:", result);
			// Try to parse JSON from result
			let parsed = null;
			try {
				const match = result.match(/\{[\s\S]*\}/);
				if (match) parsed = JSON.parse(match[0]);
			} catch (e) {
				console.error("Failed to parse AI result JSON", e);
			}
			if (parsed && typeof parsed === "object") {
				setAiResult(parsed);
				setEditFields({
					height_cm: String(parsed.height_cm ?? ""),
					weight_kg: String(parsed.weight_kg ?? ""),
					age_years: String(parsed.age_years ?? ""),
				});
			}
		} catch (err) {
			console.error("Error sending image to OpenAI:", err);
		} finally {
			setIsAIPending(false);
		}
	}

	function handleEditChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (!editFields) return;
		const {name, value} = e.target;
		setEditFields({...editFields, [name]: value});
	}

	async function handleConfirm() {
		if (!editFields) return;
		const confirmed = {
			height_cm: Number(editFields.height_cm),
			weight_kg: Number(editFields.weight_kg),
			age_years: Number(editFields.age_years),
		};
		console.log("Confirmed values:", confirmed);
		// Step 3: Send to OpenAI for stunting analysis
		const stuntingPrompt = `You are a pediatric nutrition expert. Given the following data:

- Height: ${confirmed.height_cm} cm
- Weight: ${confirmed.weight_kg} kg
- Age: ${confirmed.age_years} years

Please answer the following:
1. Is this person stunted? (Output a boolean: true if stunted, false if not)
2. What is their BMI? (number)
3. Are they underweight? (boolean)
4. How much weight (in kg) would they need to gain to be considered healthy for their age and height? (number)

Output your answer in this JSON format:
{
  "stunted": <true|false>,
  "bmi": <number>,
  "underweight": <true|false>,
  "weight_to_gain_kg": <number>,
  "notes": "<brief explanation>"
}`;
		const userMessage = `Please analyze the data for height: ${confirmed.height_cm}cm, weight: ${confirmed.weight_kg}kg, age: ${confirmed.age_years} years.`;

		setIsAIPending(true);
		try {
			const result = await sendTextChatCompletion(
				stuntingPrompt,
				userMessage
			);
			console.log("Stunting result:", result);
			setStuntingResult(result);

			// Parse JSON result and navigate to results page
			try {
				const stuntingData = JSON.parse(result);
				const params = new URLSearchParams({
					height: confirmed.height_cm.toString(),
					weight: confirmed.weight_kg.toString(),
					age: confirmed.age_years.toString(),
					bmi: stuntingData.bmi?.toString() || "0",
					stunted: stuntingData.stunted?.toString() || "false",
					underweight:
						stuntingData.underweight?.toString() || "false",
					weightToGain:
						stuntingData.weight_to_gain_kg?.toString() || "0",
					notes: stuntingData.notes || "",
				});
				router.push(
					`/public/scan/stunting/result?${params.toString()}`
				);
			} catch (parseErr) {
				console.error("Failed to parse stunting result JSON", parseErr);
			}
		} catch (err) {
			console.error("Error sending stunting request to OpenAI:", err);
		} finally {
			setIsAIPending(false);
		}
	}

	return (
		<div className="flex flex-col items-center p-4 min-h-screen pt-32">
			{/* Loading overlay - show during stunting analysis */}
			{isAIPending && aiResult && <LoadingOverlay />}

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

				{/* Countdown overlay */}
				{countdown !== null && countdown > 0 && !isFrozen && (
					<div className="absolute inset-0 flex items-center justify-center z-20">
						<div className="bg-black bg-opacity-60 rounded-lg px-8 py-6 text-white text-4xl font-bold animate-pulse">
							{countdown}
						</div>
					</div>
				)}

				{/* Freeze overlay */}
				{isFrozen && (
					<div className="absolute inset-0 flex flex-col items-center justify-center z-30">
						<div className="flex flex-col items-center mb-6">
							<div className="bg-white bg-opacity-90 rounded-full p-4 shadow-lg mb-4">
								<CheckCircle className="h-16 w-16 text-green-600" />
							</div>
							<div className="text-3xl md:text-4xl font-extrabold text-green-700 drop-shadow mb-2 tracking-tight">
								Frame Captured!
							</div>
							<div className="text-base md:text-lg text-gray-100 font-medium mb-2 text-center">
								Your pose has been successfully captured.
								<br />
								{aiResult
									? "Review and confirm the predicted data below."
									: "You can retake or continue."}
							</div>
						</div>
						{aiResult && editFields ? (
							<form className="bg-white bg-opacity-90 rounded-lg shadow-lg px-6 py-6 flex flex-col gap-4 w-full max-w-xs items-center">
								<div className="w-full">
									<label className="block text-gray-700 font-semibold mb-1">
										Height (cm)
									</label>
									<input
										type="number"
										name="height_cm"
										value={editFields.height_cm}
										onChange={handleEditChange}
										className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
									/>
								</div>
								<div className="w-full">
									<label className="block text-gray-700 font-semibold mb-1">
										Weight (kg)
									</label>
									<input
										type="number"
										name="weight_kg"
										value={editFields.weight_kg}
										onChange={handleEditChange}
										className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
									/>
								</div>
								<div className="w-full">
									<label className="block text-gray-700 font-semibold mb-1">
										Age (years)
									</label>
									<input
										type="number"
										name="age_years"
										value={editFields.age_years}
										onChange={handleEditChange}
										className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
									/>
								</div>
								<div className="w-full text-sm text-gray-600 mt-2">
									Confidence:{" "}
									<span className="font-bold">
										{aiResult.confidence}
									</span>
								</div>
								<div className="w-full text-xs text-gray-500 italic">
									{aiResult.notes}
								</div>
								<button
									type="button"
									onClick={handleConfirm}
									className="mt-4 px-6 py-2 rounded-lg bg-primary text-white font-semibold text-lg shadow-lg hover:bg-primary/90 transition-all w-full"
									disabled={isAIPending}
								>
									{isAIPending ? "Processing..." : "Confirm"}
								</button>
							</form>
						) : (
							<div className="flex gap-4">
								<button
									onClick={handleUnfreeze}
									className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-800 hover:bg-gray-700 text-white shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
									title="Retake"
									disabled={isAIPending}
								>
									<RotateCcw className="h-7 w-7" />
								</button>
								<button
									onClick={handleContinue}
									className="px-6 py-3 rounded-lg bg-primary text-white font-semibold text-lg shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center min-w-[120px]"
									disabled={isAIPending}
								>
									{isAIPending ? (
										<span className="flex items-center">
											<span className="animate-spin mr-2 h-5 w-5 border-2 border-white rounded-full border-t-transparent"></span>
											Analysing...
										</span>
									) : (
										"Continue"
									)}
								</button>
							</div>
						)}
						{stuntingResult && (
							<div className="mt-6 w-full max-w-xs bg-white bg-opacity-90 rounded-lg shadow-lg px-6 py-4">
								<div className="font-bold text-lg text-primary mb-2">
									Stunting Analysis Result
								</div>
								<pre className="text-xs text-gray-700 whitespace-pre-wrap">
									{stuntingResult}
								</pre>
							</div>
						)}
					</div>
				)}

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
						</>
					)}
				</div>

				{/* Prediction Display */}
				{webcamEnabled && !isLoading && (
					<div
						className={cn(
							"mt-4 mx-4 bg-opacity-90 text-white px-4 py-3 rounded-lg text-center",
							isPaused
								? "bg-red-900"
								: prediction.isFullyVisible &&
								  prediction.isStanding
								? "bg-green-700"
								: prediction.isFullyVisible &&
								  !prediction.isStanding
								? "bg-yellow-700"
								: "bg-red-700"
						)}
					>
						{isPaused ? (
							<div className="text-lg font-bold">PAUSED</div>
						) : (
							<>
								<div className="text-lg font-bold">
									{prediction.message}
								</div>
								<div className="text-sm mt-1">
									Detection:{" "}
									{Math.round(prediction.probability * 100)}%
								</div>
								{!prediction.isFullyVisible &&
									prediction.missingParts.length > 0 && (
										<div className="text-xs mt-1 text-red-200">
											⚠️ Make sure your entire body is
											visible
										</div>
									)}
								{prediction.isFullyVisible &&
									!prediction.isStanding && (
										<div className="text-xs mt-1 text-yellow-200">
											⚠️ Stand up straight for accurate
											measurement
										</div>
									)}
								{prediction.isFullyVisible &&
									prediction.isStanding && (
										<div className="text-xs mt-1 text-green-200">
											✅ Ready for stunting measurement
										</div>
									)}
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
