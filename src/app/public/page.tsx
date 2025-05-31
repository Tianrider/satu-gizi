"use client";

import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination, Autoplay} from "swiper/modules";
import Link from "next/link";

import "swiper/css";
import "swiper/css/pagination";
import {User} from "lucide-react";
import Navbar from "../shared/navbar";

export default function PublicHome() {
	return (
		<div className="space-y-6 pb-4">
			{/* Welcome Section */}
			<div className="flex items-center space-x-3 py-4">
				<div className="w-20 aspect-square bg-white rounded-full border-2 border-primary flex items-center justify-center">
					<User className="text-primary w-full" size={32} />
				</div>
				<div className="text-white">
					<h1 className="text-2xl font-semibold">
						Selamat Pagi,{" "}
						<span className="font-bold">Pak Oscar</span>
					</h1>
					<p className="text-sm ">
						Pantau dan Pastikan Keamanan Makanan Anak Didik Anda
					</p>
				</div>
			</div>

			{/* Quick Action Carousel */}
			<div className="space-y-3">
				<h2 className="text-lg font-semibold text-white">
					Aksi Cepat
				</h2>
				<div className="relative">
					<Swiper
						modules={[Pagination, Autoplay]}
						spaceBetween={16}
						slidesPerView={1.2}
						pagination={{
							clickable: true,
							bulletClass:
								"swiper-pagination-bullet !bg-primary/30",
							bulletActiveClass:
								"swiper-pagination-bullet-active !bg-primary",
						}}
						autoplay={{
							delay: 3000,
							disableOnInteraction: false,
						}}
						className="pb-8"
					>
						<SwiperSlide>
							<Link href="/public/scan" className="block">
								<div className="bg-gradient-to-r from-primary to-third rounded-xl p-6 text-white min-h-[140px]">
									<div className="flex items-center space-x-4">
										<div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
											<svg
												className="w-8 h-8"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
												/>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
												/>
											</svg>
										</div>
										<div className="flex-1">
											<h3 className="text-xl font-bold mb-1">
												Scan Makanan
											</h3>
											<p className="text-white/80 text-sm">
												Periksa kandungan gizi dan keamanan makanan anak didik
											</p>
										</div>
									</div>
								</div>
							</Link>
						</SwiperSlide>
						<SwiperSlide>
							<div className="bg-gradient-to-r from-third to-secondary rounded-xl p-6 text-white min-h-[140px]">
								<div className="flex items-center space-x-4">
									<div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
										<svg
											className="w-8 h-8"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
											/>
										</svg>
									</div>
									<div className="flex-1">
										<h3 className="text-xl font-bold mb-1">
											Edukasi Gizi
										</h3>
										<p className="text-white/80 text-sm">
											Pelajari panduan gizi seimbang
										</p>
									</div>
								</div>
							</div>
						</SwiperSlide>
					</Swiper>
				</div>
			</div>

			{/* Perkembangan Tumbuh Anak */}
			<div className="bg-white rounded-xl p-4 border border-gray-100">
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Monitoring Tumbuh Kembang Anak Didik
				</h3>

				<div className="flex items-center space-x-3 mb-4">
					<div className="w-12 h-12 bg-third/10 rounded-full flex items-center justify-center">
						<span className="text-2xl">👶</span>
					</div>
					<div className="flex-1">
						<div className="flex items-center space-x-2 mb-1">
							<span className="text-sm font-medium text-gray-900">
								Status gizi:
							</span>
							<span className="text-sm font-bold text-third">
								Baik
							</span>
							<span className="text-xs text-gray-500">
								tinggi badan
							</span>
							<span className="text-xs font-bold text-secondary">
								127.3 cm
							</span>
						</div>
						<p className="text-xs text-gray-600">
							Terus pantau asupan gizi untuk pertumbuhan optimal
						</p>
					</div>
				</div>

				<div className="space-y-3">
					<div>
						<div className="flex justify-between text-xs mb-1">
							<span className="text-gray-600">Tinggi Badan</span>
							<span className="font-medium">127.3 cm</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-third h-2 rounded-full"
								style={{width: "74%"}}
							></div>
						</div>
					</div>

					<div>
						<div className="flex justify-between text-xs mb-1">
							<span className="text-gray-600">Berat Badan</span>
							<span className="font-medium">25.2 kg</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-primary h-2 rounded-full"
								style={{width: "65%"}}
							></div>
						</div>
					</div>
				</div>
			</div>

			{/* AKG Summary */}
			<div className="bg-white rounded-xl p-4 border border-gray-100">
				<div className="flex items-center space-x-3 mb-4">
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
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
					</div>
					<div className="flex-1">
						<h3 className="text-lg font-semibold text-gray-900">
							Ringkasan AKG
						</h3>
					</div>
					<div className="text-right">
						<div className="text-2xl font-bold text-secondary">
							45%
						</div>
						<div className="text-xs text-gray-600">
							kebutuhan gizi harian terpenuhi
						</div>
					</div>
				</div>

				<div className="space-y-3">
					<div>
						<div className="flex justify-between text-xs mb-1">
							<span className="text-gray-600">Protein</span>
							<span className="font-medium">65%</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-third h-2 rounded-full"
								style={{width: "65%"}}
							></div>
						</div>
					</div>

					<div>
						<div className="flex justify-between text-xs mb-1">
							<span className="text-gray-600">Serat</span>
							<span className="font-medium">42%</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-secondary h-2 rounded-full"
								style={{width: "42%"}}
							></div>
						</div>
					</div>

					<div>
						<div className="flex justify-between text-xs mb-1">
							<span className="text-gray-600">Vitamin D</span>
							<span className="font-medium">28%</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-primary h-2 rounded-full"
								style={{width: "28%"}}
							></div>
						</div>
					</div>

					<div>
						<div className="flex justify-between text-xs mb-1">
							<span className="text-gray-600">Karbohidrat</span>
							<span className="font-medium">72%</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-orange-500 h-2 rounded-full"
								style={{width: "72%"}}
							></div>
						</div>
					</div>
				</div>

				<button className="w-full mt-4 py-2 text-third text-sm font-medium flex items-center justify-center">
					<svg
						className="w-4 h-4 mr-1"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</button>
			</div>

			{/* Komunitas & Berita */}
			<div className="bg-white rounded-xl p-4 border border-gray-100">
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Informasi Gizi & Keamanan Pangan
				</h3>

				<div className="space-y-4">
					<div className="flex space-x-3">
						<div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex-shrink-0 flex items-center justify-center">
							<span className="text-white text-2xl">🏫</span>
						</div>
						<div className="flex-1 min-w-0">
							<h4 className="font-medium text-sm text-gray-900 mb-1">
								Program Gizi Sekolah Berhasil Turunkan Stunting 5%
							</h4>
							<p
								className="text-xs text-gray-600 mb-2 overflow-hidden"
								style={{
									display: "-webkit-box",
									WebkitLineClamp: 2,
									WebkitBoxOrient: "vertical" as const,
								}}
							>
								Implementasi program pemantauan gizi di sekolah dasar berhasil menurunkan angka stunting sebesar 5% dalam satu tahun...
							</p>
							<button className="text-xs text-third font-medium">
								Baca Selengkapnya
							</button>
						</div>
					</div>

					<div className="flex space-x-3">
						<div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex-shrink-0 flex items-center justify-center">
							<span className="text-white text-2xl">🥬</span>
						</div>
						<div className="flex-1 min-w-0">
							<h4 className="font-medium text-sm text-gray-900 mb-1">
								Cara Mendeteksi Makanan Berbahaya untuk Anak
							</h4>
							<p className="text-xs text-gray-600 mb-2">
								Panduan lengkap mengidentifikasi makanan yang aman dan bergizi untuk anak didik
							</p>
							<button className="text-xs text-third font-medium">
								Baca Selengkapnya
							</button>
						</div>
					</div>
				</div>
			</div>

			<Navbar />
		</div>
	);
}
