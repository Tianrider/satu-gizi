interface ErrorScreenProps {
	error: string;
}

export const ErrorScreen = ({error}: ErrorScreenProps) => {
	return (
		<div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
			<div className="text-center">
				<div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
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
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
						/>
					</svg>
				</div>
				<h3 className="text-lg font-semibold mb-2">Camera Error</h3>
				<p className="text-sm text-gray-300 mb-4">{error}</p>
				<button
					onClick={() => window.location.reload()}
					className="bg-primary text-white px-6 py-2 rounded-lg font-medium"
				>
					Retry
				</button>
			</div>
		</div>
	);
};
