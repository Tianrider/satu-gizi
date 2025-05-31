import type {Metadata} from "next";

export const metadata: Metadata = {
	title: "SatuGizi - Aplikasi Masyarakat",
	description:
		"Deteksi nutrisi makanan, analisis gizi, dan edukasi untuk keluarga Indonesia",
};

export default function PublicLayout({children}: {children: React.ReactNode}) {
	return (
		<div className="mobile-container">
			<div
				className="flex flex-col min-h-screen"
				style={{
					background:
						"linear-gradient(168.59deg, #81DAD6 25%, #FFFFFF 50%, #EA85C5 87.5%, #D50B8B 100%)",
				}}
			>
				<div
					className="z-[1] absolute top-0 left-0 w-full h-full"
					style={{
						background:
							"linear-gradient(225.69deg, #D2DD25 0.12%, rgba(255, 255, 255, 0) 40%)",
					}}
				></div>

				{/* Main Content */}
				<main className="mobile-content flex-1 z-2 mb-32">
					{children}
				</main>
			</div>
		</div>
	);
}
