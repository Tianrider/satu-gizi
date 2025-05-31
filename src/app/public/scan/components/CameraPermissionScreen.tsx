interface CameraPermissionScreenProps {
	onStartCamera: () => void;
}

export const CameraPermissionScreen = ({
	onStartCamera,
}: CameraPermissionScreenProps) => {
	return (
		<div className="absolute inset-0 flex items-center justify-center h-full bg-black">
			<div className="text-center text-white">
				<div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
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
				<h3 className="text-lg font-semibold mb-2">Ready to Scan</h3>
				<p className="text-sm text-gray-300 mb-6">
					AI Model loaded successfully
				</p>
				<button
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						console.log("Button clicked!");
						onStartCamera();
					}}
					className="bg-primary text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2 mx-auto relative z-10 cursor-pointer hover:bg-primary/90 transition-colors"
					style={{pointerEvents: "auto"}}
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
							d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
						/>
					</svg>
					<span>Turn On Camera</span>
				</button>
			</div>
		</div>
	);
};
