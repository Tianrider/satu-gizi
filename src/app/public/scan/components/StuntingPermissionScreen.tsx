interface StuntingPermissionScreenProps {
	onStartCamera: () => void;
	isLoading?: boolean;
}

export const StuntingPermissionScreen = ({
	onStartCamera,
	isLoading = false,
}: StuntingPermissionScreenProps) => {
	return (
		<div className="absolute inset-0 flex items-center justify-center h-full bg-black">
			<div className="text-center text-white">
				<div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
					{isLoading ? (
						<div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
					) : (
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
								d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
							/>
						</svg>
					)}
				</div>
				<h3 className="text-lg font-semibold mb-2">
					{isLoading
						? "Setting up pose detection..."
						: "Ready to Check Stunting"}
				</h3>
				<p className="text-sm text-gray-300 mb-6">
					{isLoading
						? "Initializing camera and pose detection system"
						: "Use the back camera to position your child"}
				</p>
				<button
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						console.log("Stunting camera button clicked!");
						onStartCamera();
					}}
					disabled={isLoading}
					className={`bg-primary text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2 mx-auto relative z-10 cursor-pointer hover:bg-primary/90 transition-colors ${
						isLoading ? "opacity-50 cursor-not-allowed" : ""
					}`}
					style={{pointerEvents: "auto"}}
				>
					{isLoading ? (
						<>
							<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
							<span>Loading...</span>
						</>
					) : (
						<>
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
						</>
					)}
				</button>
			</div>
		</div>
	);
};
