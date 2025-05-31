import {RefObject} from "react";

interface StuntingCameraViewProps {
	videoRef: RefObject<HTMLVideoElement | null>;
	canvasRef: RefObject<HTMLCanvasElement | null>;
	cameraStarted: boolean;
	isLoading: boolean;
}

export const StuntingCameraView = ({
	videoRef,
	canvasRef,
	cameraStarted,
	isLoading,
}: StuntingCameraViewProps) => {
	return (
		<div className="absolute inset-0 w-full h-full relative">
			{/* Video element for stunting check */}
			<video
				ref={videoRef}
				className={`w-full h-full object-cover ${
					cameraStarted ? "block" : "hidden"
				}`}
				playsInline
				autoPlay
				muted
				style={{
					display: cameraStarted ? "block" : "none",
					position: "absolute",
					top: 0,
					left: 0,
					zIndex: 1,
				}}
			/>

			{/* Loading screen while pose detection initializes */}
			{isLoading && cameraStarted ? (
				<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
					<div className="text-center text-white">
						<div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
						<p className="text-sm">
							Initializing pose detection...
						</p>
					</div>
				</div>
			) : null}

			{/* Canvas for pose detection overlay */}
			{cameraStarted && (
				<canvas
					ref={canvasRef}
					className="absolute inset-0 w-full h-full"
					style={{
						pointerEvents: "none",
						position: "absolute",
						top: 0,
						left: 0,
						zIndex: 100,
						width: "100%",
						height: "100%",
					}}
				/>
			)}
		</div>
	);
};
