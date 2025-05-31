"use client";
import {useCameraDetection} from "../components/useCameraDetection";
import {ScanHeader} from "../components/ScanHeader";
import {ErrorScreen} from "../components/ErrorScreen";
import {CameraPermissionScreen} from "../components/CameraPermissionScreen";
import {CameraView} from "../components/CameraView";
import {InstructionOverlay} from "../components/InstructionOverlay";
import {useRouter} from "next/navigation";

export default function FoodScanPage() {
	const {videoRef, canvasRef, isLoading, error, cameraStarted, startCamera} =
		useCameraDetection();
	const router = useRouter();

	// Show error screen if there's an error
	if (error) {
		return <ErrorScreen error={error} />;
	}

	const handleContinue = () => {
		router.push("/public/scan/food/result");
	};

	return (
		<div className="min-h-screen absolute bg-black w-full h-full top-o left-0 overflow-hidden">
			<ScanHeader />

			{!isLoading && !cameraStarted ? (
				<CameraPermissionScreen onStartCamera={startCamera} />
			) : (
				<>
					<CameraView
						videoRef={videoRef}
						canvasRef={canvasRef}
						cameraStarted={cameraStarted}
						isLoading={isLoading}
					/>
					<InstructionOverlay cameraStarted={cameraStarted} />
				</>
			)}

			{/* Continue Button */}
			{cameraStarted && !isLoading && (
				<div className="absolute bottom-6 right-4 z-20">
					<button
						onClick={handleContinue}
						className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all text-lg"
					>
						Continue
					</button>
				</div>
			)}
		</div>
	);
}
