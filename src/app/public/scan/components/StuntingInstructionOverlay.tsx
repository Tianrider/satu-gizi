interface StuntingInstructionOverlayProps {
	cameraStarted: boolean;
}

export const StuntingInstructionOverlay = ({
	cameraStarted,
}: StuntingInstructionOverlayProps) => {
	if (!cameraStarted) return null;

	return (
		<div className="absolute top-36 left-4 right-4 z-20">
			<div className="text-center text-white">
				<p className="text-sm bg-black/40 backdrop-blur-sm rounded-lg px-4 py-3 leading-relaxed">
					Posisikan anak dalam bingkai kamera dengan posisi berdiri
					tegak
				</p>
			</div>
		</div>
	);
};
