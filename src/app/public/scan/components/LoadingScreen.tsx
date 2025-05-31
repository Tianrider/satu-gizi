export const LoadingScreen = () => {
	return (
		<div className="flex items-center justify-center h-full bg-black">
			<div className="text-center text-white">
				<div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
				<p className="text-sm">Loading AI Model...</p>
			</div>
		</div>
	);
};
