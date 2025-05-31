"use client";
import {useCameraDetection} from "../components/useCameraDetection";
import {ScanHeader} from "../components/ScanHeader";
import {ErrorScreen} from "../components/ErrorScreen";
import {CameraPermissionScreen} from "../components/CameraPermissionScreen";
import {CameraView} from "../components/CameraView";
import {InstructionOverlay} from "../components/InstructionOverlay";

export default function FoodScanPage() {
	const {videoRef, canvasRef, isLoading, error, cameraStarted, startCamera} =
		useCameraDetection();

	// Show error screen if there's an error
	if (error) {
		return <ErrorScreen error={error} />;
	}

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
		</div>
	);
}
