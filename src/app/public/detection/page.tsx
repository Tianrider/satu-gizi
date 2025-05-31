export default function DetectionPage() {
	return (
		<div className="space-y-6 pb-4">
			<div className="text-center py-8">
				<h1 className="text-2xl font-bold text-gray-900 mb-2">
					Deteksi Makanan
				</h1>
				<p className="text-gray-600 text-sm">
					Deteksi kerusakan dan kontaminan pada makanan
				</p>
			</div>

			{/* Detection Features */}
			<div className="grid grid-cols-1 gap-4">
				<div className="bg-white rounded-xl p-6 border border-gray-100">
					<div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
						<svg
							className="w-8 h-8 text-red-600"
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
					<h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
						Deteksi Kerusakan
					</h3>
					<p className="text-sm text-gray-600 text-center mb-4">
						Identifikasi makanan yang sudah tidak layak konsumsi
					</p>
					<button className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
						Mulai Deteksi
					</button>
				</div>

				<div className="bg-white rounded-xl p-6 border border-gray-100">
					<div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
						<svg
							className="w-8 h-8 text-orange-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
							/>
						</svg>
					</div>
					<h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
						Deteksi Kontaminan
					</h3>
					<p className="text-sm text-gray-600 text-center mb-4">
						Periksa kontaminasi berbahaya pada makanan
					</p>
					<button className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors">
						Mulai Deteksi
					</button>
				</div>
			</div>
		</div>
	);
}
