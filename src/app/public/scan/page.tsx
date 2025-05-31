"use client";
import {useState} from "react";
import {useCameraDetection} from "./components/useCameraDetection";
import {useStuntingCamera} from "./components/useStuntingCamera";
import {ScanHeader} from "./components/ScanHeader";
import {ErrorScreen} from "./components/ErrorScreen";
import {CameraPermissionScreen} from "./components/CameraPermissionScreen";
import {StuntingPermissionScreen} from "./components/StuntingPermissionScreen";
import {CameraView} from "./components/CameraView";
import {StuntingCameraView} from "./components/StuntingCameraView";
import {InstructionOverlay} from "./components/InstructionOverlay";
import {StuntingInstructionOverlay} from "./components/StuntingInstructionOverlay";

export default function ScanPage() {
	const [activeTab, setActiveTab] = useState<"scan" | "stunting">("scan");

	// Food scanning functionality
	const {
		videoRef: scanVideoRef,
		canvasRef,
		isLoading,
		error: scanError,
		cameraStarted: scanCameraStarted,
		startCamera: startScanCamera,
		stopCamera: stopScanCamera,
	} = useCameraDetection();

	// Stunting check functionality
	const {
		videoRef: stuntingVideoRef,
		error: stuntingError,
		cameraStarted: stuntingCameraStarted,
		startCamera: startStuntingCamera,
		stopCamera: stopStuntingCamera,
	} = useStuntingCamera();

	// Handle tab changes
	const handleTabChange = (tab: "scan" | "stunting") => {
		// Stop cameras when switching tabs
		if (tab !== "scan" && scanCameraStarted) {
			stopScanCamera();
		}
		if (tab !== "stunting" && stuntingCameraStarted) {
			stopStuntingCamera();
		}
		setActiveTab(tab);
	};

	// Show error screen if there's an error in the active tab
	const currentError = activeTab === "scan" ? scanError : stuntingError;
	if (currentError) {
		return <ErrorScreen error={currentError} />;
	}

	return (
		<div className="min-h-screen absolute bg-black w-full h-full top-o left-0 overflow-hidden">
			<ScanHeader activeTab={activeTab} onTabChange={handleTabChange} />

			{activeTab === "scan" ? (
				<>
					{/* Food Scanning Tab */}
					{!isLoading && !scanCameraStarted ? (
						<CameraPermissionScreen
							onStartCamera={startScanCamera}
						/>
					) : (
						<>
							<CameraView
								videoRef={scanVideoRef}
								canvasRef={canvasRef}
								cameraStarted={scanCameraStarted}
								isLoading={isLoading}
							/>
							<InstructionOverlay
								cameraStarted={scanCameraStarted}
							/>
						</>
					)}
				</>
			) : (
				<>
					{/* Stunting Check Tab */}
					{!stuntingCameraStarted ? (
						<StuntingPermissionScreen
							onStartCamera={startStuntingCamera}
						/>
					) : (
						<>
							<StuntingCameraView
								videoRef={stuntingVideoRef}
								cameraStarted={stuntingCameraStarted}
							/>
							<StuntingInstructionOverlay
								cameraStarted={stuntingCameraStarted}
							/>
						</>
					)}
				</>
			)}
		</div>
	);
}
