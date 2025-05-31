interface BoundingBox {
	x: number;
	y: number;
	width: number;
	height: number;
}

interface Prediction {
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	bbox?: BoundingBox;
	class?: string;
	className?: string;
	confidence?: number;
	color?: string;
}

declare module "inferencejs" {
	export class InferenceEngine {
		startWorker(
			model: string,
			version: string,
			key: string
		): Promise<string>;
		infer(workerId: string, image: CVImage): Promise<Prediction[]>;
	}

	export class CVImage {
		constructor(
			element: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement
		);
	}
}
