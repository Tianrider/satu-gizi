import {PosenetInput} from "@tensorflow-models/posenet/dist/types";
import {useEffect, useRef, useState} from "react";
import * as posenet from "@tensorflow-models/posenet";
import {Pose, PoseNet, ModelConfig} from "@tensorflow-models/posenet";
// import { isMobile } from "../../helpers/util";

const isMobile = () => {
	return false;
};

const config = {
	architecture: "MobileNetV1",
	outputStride: 16,
	inputResolution: {width: 300, height: 300},
	multiplier: isMobile() ? 0.5 : 0.75,
	quantBytes: 2,
};

export function usePoseNet(
	input:
		| PosenetInput
		| HTMLVideoElement
		| HTMLImageElement
		| HTMLCanvasElement
		| null
) {
	const [poses, setPoses] = useState<Pose[]>([]);
	const net = useRef<PoseNet | null>(null);

	useEffect(() => {
		(async () => {
			if (!input) {
				return [];
			}

			net.current = await posenet.load({...config} as ModelConfig);

			if ("autoplay" in input) {
				//render(input, net.current, setPoses);
				window.requestAnimationFrame(
					render(input, net.current, setPoses)
				);
			}
		})();
	}, [input]);
	return poses;
}

const render =
	(
		input: PosenetInput,
		net: PoseNet,
		setPoses: React.Dispatch<React.SetStateAction<Pose[]>>
	) =>
	async () => {
		try {
			const res: Pose[] = await net.estimatePoses(input, {
				flipHorizontal: true,
				decodingMethod: "single-person",
			});

			setPoses(res);
		} catch (error) {
			console.log(error);
		}

		window.requestAnimationFrame(render(input, net, setPoses));
	};
