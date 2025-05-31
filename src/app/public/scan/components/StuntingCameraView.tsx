import {RefObject} from "react";

interface StuntingCameraViewProps {
	videoRef: RefObject<HTMLVideoElement | null>;
	cameraStarted: boolean;
}

export const StuntingCameraView = ({
	videoRef,
	cameraStarted,
}: StuntingCameraViewProps) => {
	return (
		<div className="absolute inset-0 w-full h-full">
			{/* Simple video element for stunting check */}
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
		</div>
	);
};
