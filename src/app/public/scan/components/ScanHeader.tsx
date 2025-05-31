import {ArrowLeft} from "lucide-react";
import {useRouter} from "next/navigation";

interface ScanHeaderProps {
	activeTab: "scan" | "stunting";
	onTabChange: (tab: "scan" | "stunting") => void;
}

export const ScanHeader = ({activeTab, onTabChange}: ScanHeaderProps) => {
	const router = useRouter();

	return (
		<>
			{/* Header */}
			<div className="absolute top-0 left-0 right-0 z-20 h-14 items-center flex px-4 bg-white">
				<div className="flex items-center">
					<button
						onClick={() => router.back()}
						className="flex items-center space-x-2 text-primary font-bold"
					>
						<ArrowLeft size={20} />
						<span className="font-bold">Home</span>
					</button>
				</div>
			</div>

			{/* Tab Navigation */}
			<div className="absolute top-16 left-4 right-4 z-20">
				<div className="flex bg-white/20 backdrop-blur-sm rounded-xl p-1">
					<button
						onClick={() => onTabChange("scan")}
						className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-colors ${
							activeTab === "scan"
								? "bg-primary text-white"
								: "text-white hover:bg-white/10"
						}`}
					>
						<svg
							className="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
							<path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
						<span>Scan Makanan</span>
					</button>
					<button
						onClick={() => onTabChange("stunting")}
						className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-colors ${
							activeTab === "stunting"
								? "bg-primary text-white"
								: "text-white hover:bg-white/10"
						}`}
					>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
							/>
						</svg>
						<span>Cek Stunting</span>
					</button>
				</div>
			</div>
		</>
	);
};
