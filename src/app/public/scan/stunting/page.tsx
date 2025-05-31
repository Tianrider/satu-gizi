"use client";
import {ScanHeader} from "../components/ScanHeader";
import VideoCanvas from "../components/video";

export default function StuntingCheckPage() {
	return (
		<div className="min-h-screen absolute bg-black w-full h-full top-o left-0 overflow-hidden">
			<ScanHeader />
			<VideoCanvas />
		</div>
	);
}
