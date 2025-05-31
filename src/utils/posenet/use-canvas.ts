import {drawKeypoints, drawSkeleton} from "./use-helper";
import * as posenet from "@tensorflow-models/posenet";

export const videoWidth = 700;
export const videoHeight = 500;

export const average = (array: number[]) => {
	if (array.length === 0) {
		return 0;
	}

	return array.reduce((a, b) => a + b) / array.length;
};

export function predict(poses: posenet.Pose[]) {
	if (!poses || poses.length === 0) {
		return {
			message: "No person detected",
			probability: 0,
			isFullyVisible: false,
			missingParts: ["entire body"],
			isStanding: false,
		};
	}

	// Get the highest confidence pose
	const bestPose = poses.reduce((best, current) =>
		current.score > best.score ? current : best
	);

	if (bestPose.score < 0.3) {
		return {
			message: "Person detection confidence too low",
			probability: bestPose.score,
			isFullyVisible: false,
			missingParts: ["clear detection"],
			isStanding: false,
		};
	}

	const keypoints = bestPose.keypoints;
	const requiredParts = [
		"nose",
		"leftEye",
		"rightEye", // Head
		"leftShoulder",
		"rightShoulder", // Upper body
		"leftElbow",
		"rightElbow",
		"leftWrist",
		"rightWrist",
		"leftHip",
		"rightHip", // Lower body
		"leftKnee",
		"rightKnee",
		"leftAnkle",
		"rightAnkle",
	];

	const missingParts: string[] = [];
	const visibleParts: Record<string, posenet.Keypoint> = {};

	// Check which parts are visible with good confidence
	requiredParts.forEach((part) => {
		const keypoint = keypoints.find(
			(kp: posenet.Keypoint) => kp.part === part
		);
		if (!keypoint || keypoint.score < 0.5) {
			missingParts.push(part);
		} else {
			visibleParts[part] = keypoint;
		}
	});

	// Check if person is standing (knees should be relatively straight)
	let isStanding = false;
	if (
		visibleParts.leftHip &&
		visibleParts.leftKnee &&
		visibleParts.leftAnkle &&
		visibleParts.rightHip &&
		visibleParts.rightKnee &&
		visibleParts.rightAnkle
	) {
		// Calculate leg angles to determine if standing
		const leftLegStraight =
			Math.abs(
				visibleParts.leftHip.position.y -
					visibleParts.leftKnee.position.y
			) >
			Math.abs(
				visibleParts.leftKnee.position.y -
					visibleParts.leftAnkle.position.y
			);
		const rightLegStraight =
			Math.abs(
				visibleParts.rightHip.position.y -
					visibleParts.rightKnee.position.y
			) >
			Math.abs(
				visibleParts.rightKnee.position.y -
					visibleParts.rightAnkle.position.y
			);

		isStanding = leftLegStraight && rightLegStraight;
	}

	const isFullyVisible = missingParts.length === 0;

	// Generate message based on analysis
	let message = "";
	if (!isFullyVisible) {
		if (missingParts.length > 6) {
			message = "Move closer to camera";
		} else {
			message = `Missing: ${missingParts.slice(0, 3).join(", ")}${
				missingParts.length > 3 ? "..." : ""
			}`;
		}
	} else if (!isStanding) {
		message = "Please stand up straight";
	} else {
		message = "Perfect! Ready for measurement";
	}

	return {
		message,
		probability: bestPose.score,
		isFullyVisible,
		missingParts,
		isStanding,
	};
}

export function draw(
	canvas: HTMLCanvasElement | null,
	video: HTMLVideoElement | null,
	poses: posenet.Pose[],
	width: number,
	height: number
) {
	if (canvas === null || video === null) {
		return;
	}
	const ctx = canvas.getContext("2d");
	if (ctx === null) {
		return;
	}
	ctx.save();
	ctx.scale(-1, 1);
	ctx.translate(-width, 0);
	ctx.drawImage(video, 0, 0, width, height);
	ctx.restore();

	poses.forEach(({score, keypoints}) => {
		if (score >= 0.6) {
			drawKeypoints(keypoints, 0.1, ctx);
			drawSkeleton(keypoints, 0.1, ctx);
			//drawBoundingBox(keypoints, ctx);
		}
	});
}
