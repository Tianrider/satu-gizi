import Link from "next/link";

export default function Home() {
	return (
		<div className="mobile-container">
			<div className="min-h-screen bg-gradient-to-br from-third/10 to-secondary/10 flex flex-col justify-center items-center p-6">
				{/* Logo and Title */}
				<div className="text-center mb-12">
					<div className="w-24 h-24 bg-gradient-to-br from-primary to-third rounded-full flex items-center justify-center mx-auto mb-6">
						<span className="text-white text-2xl font-bold">
							SG
						</span>
					</div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						SatuGizi
					</h1>
					<p className="text-gray-600 text-center max-w-sm">
						Solusi komprehensif untuk deteksi nutrisi makanan dan
						perencanaan menu bergizi Indonesia
					</p>
				</div>

				{/* App Selection */}
				<div className="w-full max-w-sm space-y-4">
					{/* Public App */}
					<Link href="/public" className="block">
						<div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
							<div className="flex items-center space-x-4">
								<div className="w-12 h-12 bg-third/10 rounded-lg flex items-center justify-center">
									<svg
										className="w-6 h-6 text-third"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
										/>
									</svg>
								</div>
								<div className="flex-1">
									<h2 className="text-lg font-semibold text-gray-900">
										Aplikasi Masyarakat
									</h2>
									<p className="text-sm text-gray-600">
										Scan makanan, analisis nutrisi, edukasi
										gizi
									</p>
								</div>
								<svg
									className="w-5 h-5 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</div>

							<div className="mt-4 flex flex-wrap gap-2">
								<span className="px-2 py-1 bg-third/10 text-third text-xs rounded-full">
									CV Scan
								</span>
								<span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
									Analisis Nutrisi
								</span>
								<span className="px-2 py-1 bg-secondary/10 text-secondary/80 text-xs rounded-full">
									Edukasi
								</span>
								<span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
									Laporan AKG
								</span>
							</div>
						</div>
					</Link>

					{/* Government Dashboard */}
					<Link href="/gov" className="block">
						<div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
							<div className="flex items-center space-x-4">
								<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
									<svg
										className="w-6 h-6 text-primary"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
										/>
									</svg>
								</div>
								<div className="flex-1">
									<h2 className="text-lg font-semibold text-gray-900">
										Dashboard Pemerintah
									</h2>
									<p className="text-sm text-gray-600">
										Perencanaan menu, analisis vendor, data
										stunting
									</p>
								</div>
								<svg
									className="w-5 h-5 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</div>

							<div className="mt-4 flex flex-wrap gap-2">
								<span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
									Menu Planner
								</span>
								<span className="px-2 py-1 bg-third/10 text-third text-xs rounded-full">
									Vendor Analysis
								</span>
								<span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
									Data Stunting
								</span>
								<span className="px-2 py-1 bg-secondary/10 text-secondary/80 text-xs rounded-full">
									AI Clustering
								</span>
							</div>
						</div>
					</Link>
				</div>

				{/* Footer */}
				<div className="mt-12 text-center">
					<p className="text-xs text-gray-500">
						Dikembangkan untuk mendukung program gizi nasional
						Indonesia
					</p>
					<div className="flex justify-center space-x-4 mt-2">
						<span className="text-xs text-gray-400">v1.0.0</span>
						<span className="text-xs text-gray-400">•</span>
						<span className="text-xs text-gray-400">2024</span>
					</div>
				</div>
			</div>
		</div>
	);
}
