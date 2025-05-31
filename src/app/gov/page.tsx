export default function GovDashboard() {
	return (
		<div className="space-y-6">
			{/* Header Section */}
			<div className="bg-white rounded-lg shadow-sm p-6">
				<h1 className="text-2xl font-bold text-gray-900 mb-2">
					Constraint-Driven Menu Tuner
				</h1>
				<p className="text-gray-600">
					Rencanakan menu bergizi untuk seluruh bulan dengan parameter
					yang dapat disesuaikan
				</p>
			</div>

			{/* Control Panel */}
			<div className="bg-white rounded-lg shadow-sm p-6">
				<h2 className="text-lg font-semibold text-gray-900 mb-4">
					Parameter Kontrol
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Anggaran per Porsi */}
					<div className="space-y-2">
						<label className="block text-sm font-medium text-gray-700">
							Anggaran per Porsi
						</label>
						<div className="flex items-center space-x-4">
							<span className="text-sm text-gray-500">
								Rp 5,000
							</span>
							<input
								type="range"
								min="5000"
								max="25000"
								step="1000"
								className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
							/>
							<span className="text-sm text-gray-500">
								Rp 25,000
							</span>
						</div>
						<div className="text-center">
							<span className="text-lg font-semibold text-primary">
								Rp 12,000
							</span>
						</div>
					</div>

					{/* Target Makronutrien */}
					<div className="space-y-3">
						<label className="block text-sm font-medium text-gray-700">
							Target Makronutrien (% per hari)
						</label>
						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<span className="text-sm">Karbohidrat</span>
								<span className="text-sm font-medium">55%</span>
							</div>
							<input
								type="range"
								min="45"
								max="65"
								value="55"
								className="w-full h-2 bg-gray-200 rounded-lg"
							/>

							<div className="flex justify-between items-center">
								<span className="text-sm">Protein</span>
								<span className="text-sm font-medium">20%</span>
							</div>
							<input
								type="range"
								min="15"
								max="30"
								value="20"
								className="w-full h-2 bg-gray-200 rounded-lg"
							/>

							<div className="flex justify-between items-center">
								<span className="text-sm">Lemak</span>
								<span className="text-sm font-medium">25%</span>
							</div>
							<input
								type="range"
								min="20"
								max="35"
								value="25"
								className="w-full h-2 bg-gray-200 rounded-lg"
							/>
						</div>
					</div>

					{/* Keterbatasan Logistik */}
					<div className="space-y-2">
						<label className="block text-sm font-medium text-gray-700">
							Jarak Distribusi Maksimal
						</label>
						<div className="flex items-center space-x-4">
							<span className="text-sm text-gray-500">10 km</span>
							<input
								type="range"
								min="10"
								max="100"
								step="5"
								className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
							/>
							<span className="text-sm text-gray-500">
								100 km
							</span>
						</div>
						<div className="text-center">
							<span className="text-lg font-semibold text-third">
								50 km
							</span>
						</div>
					</div>

					{/* Ketersediaan Musiman */}
					<div className="space-y-2">
						<label className="block text-sm font-medium text-gray-700">
							Ketersediaan Musiman
						</label>
						<select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary">
							<option>Musim Hujan (Nov - Mar)</option>
							<option>Musim Kemarau (Apr - Oct)</option>
							<option>Sepanjang Tahun</option>
						</select>
						<div className="text-xs text-gray-500">
							Berdasarkan data satelit dan forecast panen
						</div>
					</div>
				</div>

				<div className="mt-6 flex justify-end">
					<button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors">
						Generate Menu Bulanan
					</button>
				</div>
			</div>

			{/* Calendar Preview */}
			<div className="bg-white rounded-lg shadow-sm p-6">
				<h2 className="text-lg font-semibold text-gray-900 mb-4">
					Preview Menu Januari 2024
				</h2>

				<div className="grid grid-cols-7 gap-2 text-center">
					{/* Header hari */}
					{["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map(
						(day) => (
							<div
								key={day}
								className="p-2 text-sm font-medium text-gray-500"
							>
								{day}
							</div>
						)
					)}

					{/* Tanggal dan menu */}
					{Array.from({length: 31}, (_, i) => i + 1).map((date) => (
						<div
							key={date}
							className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
						>
							<div className="text-sm font-medium">{date}</div>
							<div className="text-xs text-gray-600 mt-1">
								{date % 3 === 0
									? "Nasi + Ayam"
									: date % 2 === 0
									? "Nasi + Ikan"
									: "Nasi + Tempe"}
							</div>
							<div className="text-xs text-third">
								Rp{" "}
								{(10000 + (date % 5) * 1000).toLocaleString()}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Statistics */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-white rounded-lg shadow-sm p-6">
					<h3 className="text-sm font-medium text-gray-500">
						Total Anggaran Bulanan
					</h3>
					<p className="text-2xl font-bold text-primary">
						Rp 372,000
					</p>
					<p className="text-xs text-gray-500">Per anak per bulan</p>
				</div>

				<div className="bg-white rounded-lg shadow-sm p-6">
					<h3 className="text-sm font-medium text-gray-500">
						Rata-rata Kalori
					</h3>
					<p className="text-2xl font-bold text-third">1,850 kcal</p>
					<p className="text-xs text-gray-500">
						Sesuai AKG anak usia 7-9 tahun
					</p>
				</div>

				<div className="bg-white rounded-lg shadow-sm p-6">
					<h3 className="text-sm font-medium text-gray-500">
						Vendor Terlibat
					</h3>
					<p className="text-2xl font-bold text-secondary">
						12 vendor
					</p>
					<p className="text-xs text-gray-500">
						Dengan rating keamanan A
					</p>
				</div>
			</div>
		</div>
	);
}
