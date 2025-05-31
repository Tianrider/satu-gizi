export default function DashboardPage() {
	return (
		<div className="space-y-6 pb-4">
			<div className="text-center py-8">
				<h1 className="text-2xl font-bold text-gray-900 mb-2">
					Dashboard
				</h1>
				<p className="text-gray-600 text-sm">
					Pantau statistik dan analisis gizi Anda
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-2 gap-4">
				<div className="bg-white rounded-xl p-4 border border-gray-100">
					<div className="text-center">
						<div className="text-2xl font-bold text-primary mb-1">
							24
						</div>
						<div className="text-xs text-gray-600">
							Scan Hari Ini
						</div>
					</div>
				</div>
				<div className="bg-white rounded-xl p-4 border border-gray-100">
					<div className="text-center">
						<div className="text-2xl font-bold text-third mb-1">
							89%
						</div>
						<div className="text-xs text-gray-600">
							AKG Tercapai
						</div>
					</div>
				</div>
			</div>

			{/* Recent Activity */}
			<div className="bg-white rounded-xl p-4 border border-gray-100">
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Aktivitas Terbaru
				</h3>
				<div className="space-y-3">
					<div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
						<div className="w-10 h-10 bg-third/10 rounded-lg flex items-center justify-center">
							<span className="text-third text-xs font-medium">
								✓
							</span>
						</div>
						<div className="flex-1">
							<h4 className="text-sm font-medium text-gray-900">
								Scan Nasi Gudeg
							</h4>
							<p className="text-xs text-gray-600">
								Aman • 450 kcal • 2 jam lalu
							</p>
						</div>
					</div>

					<div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
						<div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
							<span className="text-primary text-xs font-medium">
								📊
							</span>
						</div>
						<div className="flex-1">
							<h4 className="text-sm font-medium text-gray-900">
								Laporan AKG Mingguan
							</h4>
							<p className="text-xs text-gray-600">
								Target tercapai 85% • 1 hari lalu
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="bg-white rounded-xl p-4 border border-gray-100">
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Aksi Cepat
				</h3>
				<div className="grid grid-cols-2 gap-3">
					<button className="bg-primary/10 text-primary p-4 rounded-lg text-sm font-medium">
						Buat Laporan
					</button>
					<button className="bg-third/10 text-third p-4 rounded-lg text-sm font-medium">
						Lihat Statistik
					</button>
				</div>
			</div>
		</div>
	);
}
