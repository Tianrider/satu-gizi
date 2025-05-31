"use client";

import {useSearchParams, useRouter} from "next/navigation";
import {ArrowLeft} from "lucide-react";
import {Suspense} from "react";
import Navbar from "@/app/shared/navbar";

function StuntingResultContent() {
	const searchParams = useSearchParams();
	const router = useRouter();

	// Get data from URL params
	const height = searchParams.get("height") || "0";
	const weight = searchParams.get("weight") || "0";
	const age = searchParams.get("age") || "0";
	const bmi = searchParams.get("bmi") || "0";
	const stunted = searchParams.get("stunted") === "true";
	const underweight = searchParams.get("underweight") === "true";
	const weightToGain = searchParams.get("weightToGain") || "0";

	// Risk factors based on analysis
	const riskFactors = [
		"Asupan gizi tidak mencukupi sejak usia dini",
		"Infeksi berulang dan penyakit kronis",
		"Kurangnya stimulasi dan perawatan anak",
		"Sanitasi dan akses air bersih yang buruk",
		"Gizi buruk selama masa kehamilan ibu",
	];

	const getBMIColor = (bmiValue: number) => {
		if (bmiValue < 18.5) return "text-red-500";
		if (bmiValue < 25) return "text-green-500";
		return "text-yellow-500";
	};

	const getBMIStatus = () => {
		if (stunted && underweight)
			return `Anak terindikasi stunting dan underweight dengan BMI ${bmi}; perlu naik ${weightToGain}kg untuk masuk kategori gizi sehat.`;
		if (stunted)
			return `Anak terindikasi stunting dengan BMI ${bmi}; perlu naik ${weightToGain}kg untuk masuk kategori gizi sehat.`;
		if (underweight)
			return `Anak terindikasi underweight dengan BMI ${bmi}; perlu naik ${weightToGain}kg untuk masuk kategori gizi sehat.`;
		return `Anak dalam kategori gizi sehat dengan BMI ${bmi}.`;
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-teal-400 to-teal-500">
			{/* Header */}
			<div className="bg-teal-400 px-4 py-6 text-white">
				<button onClick={() => router.back()} className="mb-4">
					<ArrowLeft className="h-6 w-6" />
				</button>
				<h1 className="text-xl font-bold mb-2">
					Makanan bergizimu sudah siap disajikan!
				</h1>
				<p className="text-sm opacity-90">
					Silakan dinikmati, pilihanmu mendukung pertumbuhan yang
					sehat!
				</p>
			</div>

			{/* Content */}
			<div className="px-4 py-6 space-y-6 pb-32">
				{/* Stunting Detection Results */}
				<div className="bg-white rounded-lg shadow-lg p-6">
					<h2 className="text-lg font-bold text-gray-800 mb-4">
						Hasil Deteksi Stunting
					</h2>

					{/* BMI Circle and Stats */}
					<div className="flex items-center justify-between mb-6">
						{/* BMI Circle */}
						<div className="relative">
							<div className="w-20 h-20 rounded-full border-4 border-teal-500 flex items-center justify-center bg-teal-50">
								<div className="text-center">
									<div
										className={`text-2xl font-bold ${getBMIColor(
											parseFloat(bmi)
										)}`}
									>
										{parseFloat(bmi).toFixed(1)}
									</div>
									<div className="text-xs text-gray-600">
										BMI
									</div>
								</div>
							</div>
						</div>

						{/* Status Text */}
						<div className="flex-1 ml-4">
							<p className="text-sm text-gray-700">
								{getBMIStatus()}
							</p>
						</div>
					</div>

					{/* Stats Grid */}
					<div className="grid grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-xl font-bold text-gray-800">
								{height} cm
							</div>
							<div className="text-xs text-gray-600">
								Tinggi Badan
							</div>
						</div>
						<div>
							<div className="text-xl font-bold text-gray-800">
								{weight} kg
							</div>
							<div className="text-xs text-gray-600">
								Berat Badan
							</div>
						</div>
						<div>
							<div className="text-xl font-bold text-gray-800">
								Laki-laki
							</div>
							<div className="text-xs text-gray-600">
								Jenis Kelamin
							</div>
						</div>
						<div>
							<div className="text-xl font-bold text-gray-800">
								{age} tahun
							</div>
							<div className="text-xs text-gray-600">Usia</div>
						</div>
					</div>
				</div>

				{/* Risk Factors */}
				<div className="bg-white rounded-lg shadow-lg p-6">
					<h3 className="text-lg font-bold text-gray-800 mb-4">
						Risiko Teridentifikasi Penyebab Stunting
					</h3>
					<ul className="space-y-3">
						{riskFactors.map((factor, index) => (
							<li key={index} className="flex items-start">
								<div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
								<span className="text-sm text-gray-700">
									{factor}
								</span>
							</li>
						))}
					</ul>
				</div>
			</div>

			<Navbar />
		</div>
	);
}

export default function StuntingResultPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<StuntingResultContent />
		</Suspense>
	);
}
