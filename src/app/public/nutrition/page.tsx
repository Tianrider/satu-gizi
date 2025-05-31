export default function NutritionPage() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="text-center py-4">
				<h1 className="text-2xl font-bold text-gray-900 mb-2">
					Analisis Nutrisi
				</h1>
				<p className="text-gray-600 text-sm">
					Pantau kandungan gizi makanan Anda
				</p>
			</div>

			{/* Quick Stats */}
			<div className="grid grid-cols-2 gap-4">
				<div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
					<div className="text-2xl font-bold text-primary">1,245</div>
					<div className="text-xs text-gray-600">Kalori Hari Ini</div>
				</div>
				<div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
					<div className="text-2xl font-bold text-third">85%</div>
					<div className="text-xs text-gray-600">Target AKG</div>
				</div>
			</div>

			{/* Nutrition Breakdown */}
			<div className="bg-white rounded-lg border border-gray-200 p-4">
				<h3 className="font-semibold text-gray-900 mb-4">
					Breakdown Nutrisi
				</h3>

				<div className="space-y-4">
					<div>
						<div className="flex justify-between text-sm mb-1">
							<span>Protein</span>
							<span>65g / 75g</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-third h-2 rounded-full"
								style={{width: "87%"}}
							></div>
						</div>
					</div>

					<div>
						<div className="flex justify-between text-sm mb-1">
							<span>Karbohidrat</span>
							<span>180g / 250g</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-orange-600 h-2 rounded-full"
								style={{width: "72%"}}
							></div>
						</div>
					</div>

					<div>
						<div className="flex justify-between text-sm mb-1">
							<span>Lemak</span>
							<span>45g / 60g</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-primary h-2 rounded-full"
								style={{width: "75%"}}
							></div>
						</div>
					</div>
				</div>
			</div>

			{/* Recent Foods */}
			<div className="bg-white rounded-lg border border-gray-200 p-4">
				<h3 className="font-semibold text-gray-900 mb-4">
					Makanan Terakhir
				</h3>

				<div className="space-y-3">
					<div className="flex justify-between items-center">
						<div>
							<div className="font-medium text-sm">
								Nasi Gudeg
							</div>
							<div className="text-xs text-gray-600">
								450 kcal • 2 jam lalu
							</div>
						</div>
						<button className="text-primary text-xs">Detail</button>
					</div>

					<div className="flex justify-between items-center">
						<div>
							<div className="font-medium text-sm">
								Sayur Bayam
							</div>
							<div className="text-xs text-gray-600">
								35 kcal • 5 jam lalu
							</div>
						</div>
						<button className="text-primary text-xs">Detail</button>
					</div>
				</div>
			</div>
		</div>
	);
}
