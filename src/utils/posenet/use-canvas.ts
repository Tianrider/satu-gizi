import {drawKeypoints, drawSkeleton} from "./use-helper";
import * as posenet from "@tensorflow-models/posenet";
import {multiPoseDetection} from "./use-posenet";

export const videoWidth = 700;
export const videoHeight = 500;

export const average = (array: number[]) => {
	if (array.length === 0) {
		return 0;
	}

	return array.reduce((a, b) => a + b) / array.length;
};

export function predict(poses: posenet.Pose[]) {
	const maxPose: posenet.Pose = poses.reduce(
		(a, b) => (a.score > b.score ? a : b),
		{
			score: 0,
		} as posenet.Pose
	);

	if (maxPose.score === 0) {
		return {message: "-", probability: 1};
	} else {
		const rightShoulder = maxPose.keypoints.filter(
			(k) => k.part === "rightShoulder"
		)[0];
		const rightElbow = maxPose.keypoints.filter(
			(k) => k.part === "rightElbow"
		)[0];
		// const rightWrist = maxPose.keypoints.filter(
		// 	(k) => k.part === "rightWrist"
		// )[0];

		const leftKnee = maxPose.keypoints.filter(
			(k) => k.part === "leftKnee"
		)[0];
		const rightKnee = maxPose.keypoints.filter(
			(k) => k.part === "rightKnee"
		)[0];

		const leftHip = maxPose.keypoints.filter(
			(k) => k.part === "leftHip"
		)[0];
		const rightHip = maxPose.keypoints.filter(
			(k) => k.part === "rightHip"
		)[0];

		return "hi";
		// }

		// return {message: "-", probability: rightShoulder.score};
	}
}

export function draw(
	canvas: HTMLCanvasElement | null,
	video: HTMLVideoElement | null,
	poses: posenet.Pose[]
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
	ctx.translate(-videoWidth, 0);
	ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
	ctx.restore();

	poses.forEach(({score, keypoints}) => {
		if (score >= multiPoseDetection.minPoseConfidence) {
			drawKeypoints(keypoints, multiPoseDetection.minPartConfidence, ctx);
			drawSkeleton(keypoints, multiPoseDetection.minPartConfidence, ctx);
			//drawBoundingBox(keypoints, ctx);
		}
	});
}

export function getFormattedDuration(startTime: Date, finishTime: Date) {
	const timeDifference = finishTime.getTime() - startTime.getTime();

	const minutes = Math.floor(timeDifference / 60000); // 1 minute = 60000 milliseconds
	const seconds = Math.floor((timeDifference % 60000) / 1000); // 1 second = 1000 milliseconds

	// Format the result as MM:ss
	const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
		seconds
	).padStart(2, "0")}`;

	return formattedTime;
}

export function getDuration(startTime: Date, finishTime: Date) {
	if (!startTime || !finishTime) {
		return 0;
	}
	const timeDifference = finishTime.getTime() - startTime.getTime();

	return timeDifference / 1000;
}
