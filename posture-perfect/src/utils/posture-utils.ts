import { POSE_LANDMARKS } from "@mediapipe/holistic";
import { findDistance } from "./math-utils";
import { POSE_INDEXES_LATERAL } from "./canvas-utils";

enum PostureView {
  ANTERIOR = "anterior",
  LATERAL = "lateral",
}

// -- thresholds
const OFFSET_THRESHOLD = 0.1;

/**
 * Check in the results returned by mediapipe holistic if certain landmarks are visible on the camera.
 * If not, then you cannot check the posture.
 * @param obj - results.poseLandmarks
 * @param keys - the landmark indexes
 * @returns - true if every landmark is visible, false otherwise
 */
const doLandmarksExist = (obj: any, keys: any[]): boolean => {
  for (let i = 0; i < keys.length; i++) {
    if (obj[keys[i]].visibility < 0.3) {
      return false;
    }
  }

  return true;
};

/**
 * Check if the user is facing the camera with an angle of 90 degrees
 * @param leftShoulder
 * @param rightShoulder
 * @returns
 */
const checkLateralCameraAlignment = (leftShoulder: any, rightShoulder: any) => {
  const offset = findDistance(leftShoulder.x, leftShoulder.y, rightShoulder.x, rightShoulder.y);
  return offset > OFFSET_THRESHOLD ? false : true;
};

/**
 * Validates if the camera is positioned correctly for identifying and correcting the posture
 * @param lmPose - for getting the distance between the left and right shoulders
 * @param setIsLateralPositionGood - set it to true if the user is facing the camera with an angle of 90 degrees
 * @param setAreLandmarksVisible - set it to true if the whole posture (meaning the landmarks needed) is captured by the camera
 * @returns {boolean} true if the position is valid.
 */
const validateLateralCameraView = (lmPose: any, setIsLateralPositionGood: any, setAreLandmarksVisible: any) => {
  if (doLandmarksExist(lmPose, POSE_INDEXES_LATERAL)) {
    setAreLandmarksVisible(true);
    const leftShoulder = lmPose[POSE_LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = lmPose[POSE_LANDMARKS.RIGHT_SHOULDER];
    if (checkLateralCameraAlignment(leftShoulder, rightShoulder)) {
      setIsLateralPositionGood(true);
    } else {
      setIsLateralPositionGood(false);
      return false;
    }
  } else {
    setAreLandmarksVisible(false);
    return false;
  }

  return true;
};

const checkLateralPosture = (
  goodFrames: number,
  badFrames: number,
  results: any,
  setIsLateralPositionGood: any,
  setAreLandmarksVisible: any
) => {
  const lmPose = results.poseLandmarks;

  if (validateLateralCameraView(lmPose, setIsLateralPositionGood, setAreLandmarksVisible)) {
    const leftShoulder = lmPose[POSE_LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = lmPose[POSE_LANDMARKS.RIGHT_SHOULDER];
    const leftEar = lmPose[POSE_LANDMARKS.LEFT_EAR];
    const rightEar = lmPose[POSE_LANDMARKS.RIGHT_EAR];
    const leftHip = lmPose[POSE_LANDMARKS.LEFT_HIP];
    const rightHip = lmPose[POSE_LANDMARKS.RIGHT_HIP];
  }
};

const checkAnteriorPosture = () => {};

export { PostureView, checkLateralPosture, checkAnteriorPosture };
