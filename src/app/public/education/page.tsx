export default function EducationPage() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="text-center py-4">
				<h1 className="text-2xl font-bold text-gray-900 mb-2">
					Edukasi Gizi
				</h1>
				<p className="text-gray-600 text-sm">
					Pelajari manfaat gizi untuk keluarga
				</p>
			</div>

			{/* Featured Article */}
			<div className="bg-gradient-to-r from-third to-primary rounded-xl p-6 text-white">
				<h2 className="text-lg font-semibold mb-2">Artikel Pilihan</h2>
				<h3 className="text-xl font-bold mb-2">
					Pentingnya Protein untuk Anak
				</h3>
				<p className="text-white/80 text-sm mb-4">
					Protein berperan penting dalam pertumbuhan dan perkembangan
					anak...
				</p>
				<button className="bg-white text-third px-4 py-2 rounded-lg text-sm font-medium">
					Baca Selengkapnya
				</button>
			</div>

			{/* Categories */}
			<div className="grid grid-cols-2 gap-4">
				<div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
					<div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
						<span className="text-2xl">🥕</span>
					</div>
					<h3 className="font-semibold text-sm mb-1">
						Vitamin & Mineral
					</h3>
					<p className="text-xs text-gray-600">12 artikel</p>
				</div>

				<div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
					<div className="w-12 h-12 bg-third/10 rounded-lg flex items-center justify-center mx-auto mb-3">
						<span className="text-2xl">🍗</span>
					</div>
					<h3 className="font-semibold text-sm mb-1">Protein</h3>
					<p className="text-xs text-gray-600">8 artikel</p>
				</div>

				<div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
					<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
						<span className="text-2xl">🍎</span>
					</div>
					<h3 className="font-semibold text-sm mb-1">Buah & Sayur</h3>
					<p className="text-xs text-gray-600">15 artikel</p>
				</div>

				<div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
					<div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
						<span className="text-2xl">👶</span>
					</div>
					<h3 className="font-semibold text-sm mb-1">Gizi Anak</h3>
					<p className="text-xs text-gray-600">10 artikel</p>
				</div>
			</div>

			{/* Recent Articles */}
			<div className="bg-white rounded-lg border border-gray-200 p-4">
				<h3 className="font-semibold text-gray-900 mb-4">
					Artikel Terbaru
				</h3>

				<div className="space-y-4">
					<div className="flex space-x-3">
						<div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
						<div className="flex-1">
							<h4 className="font-medium text-sm mb-1">
								Manfaat Sayuran Hijau untuk Pertumbuhan
							</h4>
							<p className="text-xs text-gray-600 mb-2">
								Sayuran hijau kaya akan zat besi dan folat yang
								penting untuk...
							</p>
							<div className="flex items-center text-xs text-gray-500">
								<span>5 min baca</span>
								<span className="mx-2">•</span>
								<span>2 hari lalu</span>
							</div>
						</div>
					</div>

					<div className="flex space-x-3">
						<div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
						<div className="flex-1">
							<h4 className="font-medium text-sm mb-1">
								Cara Memilih Ikan Segar dan Bergizi
							</h4>
							<p className="text-xs text-gray-600 mb-2">
								Tips memilih ikan yang masih segar dan kaya
								omega-3...
							</p>
							<div className="flex items-center text-xs text-gray-500">
								<span>3 min baca</span>
								<span className="mx-2">•</span>
								<span>1 minggu lalu</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Interactive Quiz */}
			<div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
				<div className="flex items-center space-x-3">
					<div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
						<span className="text-secondary text-lg">🧠</span>
					</div>
					<div className="flex-1">
						<h3 className="font-semibold text-sm">
							Kuis Gizi Harian
						</h3>
						<p className="text-xs text-gray-600">
							Uji pengetahuan gizi Anda hari ini
						</p>
					</div>
					<button className="bg-secondary text-white px-3 py-1 rounded text-xs">
						Mulai
					</button>
				</div>
			</div>
		</div>
	);
}
