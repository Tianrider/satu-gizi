import type {Metadata} from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Dashboard Pemerintah - SatuGizi",
	description:
		"Dashboard untuk perencanaan menu bergizi dan analisis data stunting real-time",
};

export default function GovLayout({children}: {children: React.ReactNode}) {
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header untuk Dashboard Pemerintah */}
			<header className="bg-white shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center">
							<h1 className="text-xl font-semibold text-gray-900">
								SatuGizi Dashboard
							</h1>
							<span className="ml-2 px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
								Pemerintah
							</span>
						</div>
						<nav className="flex space-x-8">
							<Link
								href="/gov"
								className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium"
							>
								Menu Planner
							</Link>
							<Link
								href="/gov/vendors"
								className="text-gray-700 hover:text-third px-3 py-2 text-sm font-medium"
							>
								Vendor Analysis
							</Link>
							<Link
								href="/gov/stunting"
								className="text-gray-700 hover:text-secondary px-3 py-2 text-sm font-medium"
							>
								Data Stunting
							</Link>
						</nav>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
				{children}
			</main>
		</div>
	);
}
