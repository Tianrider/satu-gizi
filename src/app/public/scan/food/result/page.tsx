"use client";

import {useRouter} from "next/navigation";
import {ArrowLeft} from "lucide-react";
import Image from "next/image";
import Navbar from "@/app/shared/navbar";

export default function FoodResultPage() {
	const router = useRouter();

	return (
		<div className="min-h-screen bg-gradient-to-br from-pink-400 to-white">
			{/* Header */}
			<div className="px-4 py-6 text-white">
				<button onClick={() => router.back()} className="mb-4">
					<ArrowLeft className="h-6 w-6" />
				</button>
				<h1 className="text-xl font-bold mb-2">
					Hai, makanan bergizimu sudah siap disajikan!
				</h1>
				<p className="text-sm opacity-90">
					Silakan dinikmati, pilihanmu mendukung pertumbuhan yang
					sehat!
				</p>
			</div>

			{/* Content */}
			<div className="px-4 pb-24 space-y-6">
				{/* Food Card with background image */}
				<div className="flex flex-col w-full">
					<div className="relative rounded-lg shadow-lg overflow-hidden h-48">
						<Image
							src="/food-image/food-image-1.jpg"
							alt="Nasi Ayam Kecap"
							fill
							className="object-cover"
						/>
						{/* Overlay gradient */}
						<div className="absolute inset-0 bg-gradient-to-b from-teal-500/90 to-transparent"></div>
						{/* Text content */}
						<div className="absolute inset-0 p-6 flex flex-col text-white">
							<h2 className="text-lg font-bold mb-2">
								Makanan aman dan sesuai kebutuhan gizi!
							</h2>
						</div>
					</div>

					{/* Food Details */}
					<div className="bg-white rounded-b-lg -mt-2 shadow-lg p-4">
						<h3 className="text-xl font-bold text-gray-800">
							Nasi Ayam Kecap
						</h3>
						<div className="text-sm text-gray-600">
							<p>
								Nasi: 300 gr, Ayam (dada): 150 gr, Buncis: 50
								gr, Wortel: 100 gr, Susu: 250 ml, Jeruk: 50 gr
							</p>
						</div>
					</div>
				</div>

				{/* Analysis Section */}
				<div className="bg-white rounded-lg shadow-lg p-6">
					<h3 className="text-lg font-bold text-gray-800 mb-6">
						Analisis Konsumsi
					</h3>

					<div className="grid grid-cols-2 gap-6">
						{/* AKG Terpenuhi */}
						<div className="text-center">
							<div className="relative w-20 h-20 mx-auto mb-3">
								<svg
									className="w-20 h-20 transform -rotate-90"
									viewBox="0 0 36 36"
								>
									<path
										d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
										fill="none"
										stroke="#e5e7eb"
										strokeWidth="3"
									/>
									<path
										d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
										fill="none"
										stroke="#10b981"
										strokeWidth="3"
										strokeDasharray="75, 100"
									/>
								</svg>
								<div className="absolute inset-0 flex items-center justify-center">
									<span className="text-2xl font-bold text-green-600">
										75%
									</span>
								</div>
							</div>
							<p className="text-sm font-semibold text-gray-800">
								AKG Terpenuhi
							</p>
							<p className="text-xs text-gray-500">Lihat Lebih</p>
						</div>

						{/* Nutrisi Meningkat */}
						<div className="text-center">
							<div className="relative w-20 h-20 mx-auto mb-3">
								<svg
									className="w-20 h-20 transform -rotate-90"
									viewBox="0 0 36 36"
								>
									<path
										d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
										fill="none"
										stroke="#e5e7eb"
										strokeWidth="3"
									/>
									<path
										d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
										fill="none"
										stroke="#fbbf24"
										strokeWidth="3"
										strokeDasharray="60, 100"
									/>
								</svg>
								<div className="absolute inset-0 flex items-center justify-center">
									<span className="text-2xl font-bold text-yellow-500">
										60%
									</span>
								</div>
							</div>
							<p className="text-sm font-semibold text-gray-800">
								Nutrisi Meningkat
							</p>
							<p className="text-xs text-gray-500">Lihat Lebih</p>
						</div>
					</div>

					<div className="mt-6 text-xs text-gray-600">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="font-medium">
									Menu ini memberikan energi yang tinggi untuk
									aktivitas anak sehari-hari, terisi nutrisi
									lengkap untuk berperan asupan yang optimal.
								</p>
							</div>
							<div>
								<p className="font-medium">
									Adanya dari nutrisi kalsium dari susu maupun
									protein untuk membantu pertumbuhan anak yang
									optimal untuk tumbuh kembang anak.
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Story Behind Food */}
				<div className="bg-white rounded-lg shadow-lg p-6">
					<h3 className="text-lg font-bold text-gray-800 mb-4">
						Cerita dibalik makananmu
					</h3>

					<div className="space-y-4">
						<div className="border border-gray-200 rounded-lg p-4">
							<h4 className="font-semibold text-teal-600 mb-2">
								Brokoli pedang perisa radikal Ipoh
							</h4>
							<p className="text-sm text-gray-600 mb-3">
								15rb Rp/porsi
							</p>

							<div className="text-xs text-gray-700 space-y-2">
								<p>
									<strong>Bahan-bahan:</strong>
								</p>
								<p>
									Brokoli saja dengan kukus telah-malah,
									mutual setiap huju tambahan. Brokoli kala
									kemarin pol. Dengan pedang antara dalam
									dengan anak vitamin C
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Navbar />
		</div>
	);
}
