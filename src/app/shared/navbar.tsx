"use client";

import Link from "next/link";
import Image from "next/image";
import {usePathname} from "next/navigation";

export default function Navbar() {
	const pathname = usePathname();

	return (
		<nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-200 px-4 py-2 z-50">
			<div className="flex items-center justify-around relative">
				{/* Deteksi Tab */}
				<Link
					href="/public/detection"
					className="flex flex-col items-center justify-center py-2 px-4"
				>
					<div className="w-8 h-8 mb-1 flex items-center justify-center">
						<Image
							src="/deteksi.png"
							alt="Deteksi"
							width={32}
							height={32}
							className="w-full h-full object-contain"
						/>
					</div>
					<span className="text-xs text-gray-600 font-medium">
						Deteksi
					</span>
					{pathname === "/public/detection" && (
						<div className="w-8 h-0.5 bg-secondary mt-1 rounded-full"></div>
					)}
				</Link>

				{/* Scan Tab (Center with special styling) */}
				<Link
					href="/public/scan"
					className="flex flex-col items-center justify-center relative -mt-4"
				>
					<div className="w-16 h-16 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
						<div className="w-12 h-12 bg-gradient-to-br from-primary to-pink-600 rounded-full flex items-center justify-center">
							<Image
								src="/logo.png"
								alt="Scan"
								width={24}
								height={24}
								className="w-6 h-6 object-contain"
							/>
						</div>
					</div>
					<span className="text-xs text-gray-600 font-medium mt-1">
						Scan
					</span>
				</Link>

				{/* Dashboard Tab */}
				<Link
					href="/public/dashboard"
					className="flex flex-col items-center justify-center py-2 px-4"
				>
					<div className="w-8 h-8 mb-1 flex items-center justify-center">
						<Image
							src="/dashboard.png"
							alt="Dashboard"
							width={32}
							height={32}
							className="w-full h-full object-contain"
						/>
					</div>
					<span className="text-xs text-gray-600 font-medium">
						Dashboard
					</span>
				</Link>
			</div>
		</nav>
	);
}
