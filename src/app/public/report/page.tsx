export default function ReportPage() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="text-center py-4">
				<h1 className="text-2xl font-bold text-gray-900 mb-2">
					Laporan AKG
				</h1>
				<p className="text-gray-600 text-sm">
					Pantau kecukupan gizi harian keluarga
				</p>
			</div>

			{/* Weekly Summary */}
			<div className="bg-white rounded-lg border border-gray-200 p-4">
				<h3 className="font-semibold text-gray-900 mb-4">
					Ringkasan Minggu Ini
				</h3>

				<div className="grid grid-cols-2 gap-4 mb-4">
					<div className="text-center">
						<div className="text-2xl font-bold text-third">85%</div>
						<div className="text-xs text-gray-600">
							Rata-rata AKG
						</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-primary">
							6/7
						</div>
						<div className="text-xs text-gray-600">
							Hari Tercukupi
						</div>
					</div>
				</div>

				<div className="space-y-3">
					<div>
						<div className="flex justify-between text-sm mb-1">
							<span>Target Kalori Harian</span>
							<span>1,850 / 2,000 kcal</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-third h-2 rounded-full"
								style={{width: "92%"}}
							></div>
						</div>
					</div>
				</div>
			</div>

			{/* Daily Breakdown */}
			<div className="bg-white rounded-lg border border-gray-200 p-4">
				<h3 className="font-semibold text-gray-900 mb-4">
					Breakdown Harian
				</h3>

				<div className="space-y-3">
					{[
						{
							day: "Senin",
							percentage: 95,
							status: "Tercukupi",
							color: "green",
						},
						{
							day: "Selasa",
							percentage: 88,
							status: "Tercukupi",
							color: "green",
						},
						{
							day: "Rabu",
							percentage: 72,
							status: "Kurang",
							color: "yellow",
						},
						{
							day: "Kamis",
							percentage: 91,
							status: "Tercukupi",
							color: "green",
						},
						{
							day: "Jumat",
							percentage: 85,
							status: "Tercukupi",
							color: "green",
						},
						{
							day: "Sabtu",
							percentage: 78,
							status: "Kurang",
							color: "yellow",
						},
						{
							day: "Minggu",
							percentage: 89,
							status: "Tercukupi",
							color: "green",
						},
					].map((item, index) => (
						<div
							key={index}
							className="flex items-center justify-between"
						>
							<div className="flex items-center space-x-3">
								<span className="text-sm font-medium w-16">
									{item.day}
								</span>
								<div className="flex-1 w-32">
									<div className="w-full bg-gray-200 rounded-full h-2">
										<div
											className={`h-2 rounded-full ${
												item.color === "green"
													? "bg-third"
													: "bg-secondary"
											}`}
											style={{
												width: `${item.percentage}%`,
											}}
										></div>
									</div>
								</div>
							</div>
							<div className="text-right">
								<div className="text-sm font-medium">
									{item.percentage}%
								</div>
								<div
									className={`text-xs ${
										item.color === "green"
											? "text-third"
											: "text-secondary"
									}`}
								>
									{item.status}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Nutrition Details */}
			<div className="bg-white rounded-lg border border-gray-200 p-4">
				<h3 className="font-semibold text-gray-900 mb-4">
					Detail Nutrisi Hari Ini
				</h3>

				<div className="space-y-4">
					<div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
						<div>
							<div className="font-medium text-sm">Protein</div>
							<div className="text-xs text-gray-600">
								65g dari 75g target
							</div>
						</div>
						<div className="text-right">
							<div className="text-sm font-bold text-third">
								87%
							</div>
							<div className="text-xs text-third">Tercukupi</div>
						</div>
					</div>

					<div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
						<div>
							<div className="font-medium text-sm">
								Karbohidrat
							</div>
							<div className="text-xs text-gray-600">
								180g dari 250g target
							</div>
						</div>
						<div className="text-right">
							<div className="text-sm font-bold text-secondary">
								72%
							</div>
							<div className="text-xs text-secondary">Kurang</div>
						</div>
					</div>

					<div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
						<div>
							<div className="font-medium text-sm">Lemak</div>
							<div className="text-xs text-gray-600">
								45g dari 60g target
							</div>
						</div>
						<div className="text-right">
							<div className="text-sm font-bold text-primary">
								75%
							</div>
							<div className="text-xs text-primary">
								Tercukupi
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Recommendations */}
			<div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
				<h3 className="font-semibold text-primary mb-3">Rekomendasi</h3>
				<div className="space-y-2">
					<div className="flex items-start space-x-2">
						<span className="text-primary text-sm">•</span>
						<p className="text-sm text-gray-800">
							Tambahkan nasi atau roti untuk memenuhi kebutuhan
							karbohidrat
						</p>
					</div>
					<div className="flex items-start space-x-2">
						<span className="text-primary text-sm">•</span>
						<p className="text-sm text-gray-800">
							Konsumsi buah-buahan untuk vitamin dan mineral
							tambahan
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
