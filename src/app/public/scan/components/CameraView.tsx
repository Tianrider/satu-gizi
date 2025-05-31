import {RefObject} from "react";
import {LoadingScreen} from "./LoadingScreen";

interface CameraViewProps {
	videoRef: RefObject<HTMLVideoElement | null>;
	canvasRef: RefObject<HTMLCanvasElement | null>;
	cameraStarted: boolean;
	isLoading: boolean;
}

export const CameraView = ({
	videoRef,
	canvasRef,
	cameraStarted,
	isLoading,
}: CameraViewProps) => {
	return (
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
				<LoadingScreen />
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
	);
};
