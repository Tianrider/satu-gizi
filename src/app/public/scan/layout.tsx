import type {Metadata} from "next";

export const metadata: Metadata = {
	title: "SatuGizi - Food Scanner",
	description: "AI-powered food detection and nutrition analysis",
};

export default function ScanLayout({children}: {children: React.ReactNode}) {
	return (
		<div className="w-full h-screen absolute top-0 left-0 overflow-hidden">
			{children}
		</div>
	);
}
