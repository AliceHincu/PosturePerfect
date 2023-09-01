import { POSE_LANDMARKS } from "@mediapipe/pose";
const extractAnteriorLandmarks = (pLandmarks: any) => {
  return {
    [POSE_LANDMARKS.LEFT_EYE]: pLandmarks[POSE_LANDMARKS.LEFT_EYE],
    [POSE_LANDMARKS.RIGHT_EYE]: pLandmarks[POSE_LANDMARKS.RIGHT_EYE],
    [POSE_LANDMARKS.LEFT_SHOULDER]: pLandmarks[POSE_LANDMARKS.LEFT_SHOULDER],
    [POSE_LANDMARKS.RIGHT_SHOULDER]: pLandmarks[POSE_LANDMARKS.RIGHT_SHOULDER],
    [POSE_LANDMARKS.LEFT_ELBOW]: pLandmarks[POSE_LANDMARKS.LEFT_ELBOW],
    [POSE_LANDMARKS.RIGHT_ELBOW]: pLandmarks[POSE_LANDMARKS.RIGHT_ELBOW],
    [POSE_LANDMARKS.NOSE]: pLandmarks[POSE_LANDMARKS.NOSE],
  };
};

const extractLateralLandmarks = (pLandmarks: any) => {
  return {
    [POSE_LANDMARKS.LEFT_EAR]: pLandmarks[POSE_LANDMARKS.LEFT_EAR],
    [POSE_LANDMARKS.RIGHT_EAR]: pLandmarks[POSE_LANDMARKS.RIGHT_EAR],
    [POSE_LANDMARKS.LEFT_SHOULDER]: pLandmarks[POSE_LANDMARKS.LEFT_SHOULDER],
    [POSE_LANDMARKS.RIGHT_SHOULDER]: pLandmarks[POSE_LANDMARKS.RIGHT_SHOULDER],
    [POSE_LANDMARKS.LEFT_HIP]: pLandmarks[POSE_LANDMARKS.LEFT_HIP],
    [POSE_LANDMARKS.RIGHT_HIP]: pLandmarks[POSE_LANDMARKS.RIGHT_HIP],
    [POSE_LANDMARKS.NOSE]: pLandmarks[POSE_LANDMARKS.NOSE],
  };
};

export const extractLandmarks = (postureView: PostureView, pLandmarks: any) => {
  return postureView === PostureView.ANTERIOR
    ? extractAnteriorLandmarks(pLandmarks)
    : extractLateralLandmarks(pLandmarks);
};

export enum PostureView {
  ANTERIOR = "anterior",
  LATERAL = "lateral",
}

export const MODEL_COMPLEXITY = ["Lite", "Full", "Heavy"];

export type ThresholdStrictness = "Gentle" | "Moderate" | "Strict";
export const THRESHOLD_VALUES_ARRAY: ThresholdStrictness[] = ["Gentle", "Moderate", "Strict"];

// Define initial thresholds
export interface Thresholds {
  OFFSET_THRESHOLD: number;
  NECK_INCLINATION_THRESHOLD: number;
  TORSO_INCLINATION_THRESHOLD: number;
  ALIGNMENT_SHOULDERS_THRESHOLD_ANTERIOR: number;
  ALIGNMENT_EYES_THRESHOLD_ANTERIOR: number;
}

export const initialThresholds: Thresholds = {
  OFFSET_THRESHOLD: 0.2,
  NECK_INCLINATION_THRESHOLD: 15,
  TORSO_INCLINATION_THRESHOLD: 1.5,
  ALIGNMENT_SHOULDERS_THRESHOLD_ANTERIOR: 0.025,
  ALIGNMENT_EYES_THRESHOLD_ANTERIOR: 0.025,
};
