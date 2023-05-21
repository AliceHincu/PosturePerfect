import { POSE_LANDMARKS } from "@mediapipe/holistic";
import { findAngle, findDistance } from "./math-utils";
import { POSE_INDEXES_LATERAL, POSE_INDEXES_ANTERIOR } from "./canvas-utils";

enum PostureView {
  ANTERIOR = "anterior",
  LATERAL = "lateral",
}

// -- thresholds
const OFFSET_THRESHOLD = 0.2;
const NECK_INCLINATION_THRESHOLD = 15;
const TORSO_INCLINATION_THRESHOLD = 1.5;

/**
 * Check in the results returned by mediapipe holistic if certain landmarks are visible on the camera.
 * If not, then you cannot check the posture.
 * @param obj - results.poseLandmarks
 * @param keys - the landmark indexes
 * @returns - true if every landmark is visible, false otherwise
 */
export const doLandmarksExist = (obj: any, keys: any[]): boolean => {
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

    // calculate angles.
    const neckInclination = findAngle(leftShoulder.x, leftShoulder.y, leftEar.x, leftEar.y);
    const torsoInclination = findAngle(leftHip.x, leftHip.y, leftShoulder.x, leftShoulder.y);

    console.log("neck: ", neckInclination, " --- torso:", torsoInclination);
    if (neckInclination < NECK_INCLINATION_THRESHOLD && torsoInclination < TORSO_INCLINATION_THRESHOLD) {
      return true;
    }
  }
  return false;
};

/// ============================================================

const ALIGNMENT_THRESHOLD = 0.1; // Tolerance value, adjust as necessary

const checkAnteriorAlignment = (
  currentLandmark1: any,
  currentLandmark2: any,
  calibLandmark1: any,
  calibLandmark2: any
) => {
  // Calculate the current and calibrated distances
  const currentDist = findDistance(currentLandmark1.x, currentLandmark1.y, currentLandmark2.x, currentLandmark2.y);
  const calibDist = findDistance(calibLandmark1.x, calibLandmark1.y, calibLandmark2.x, calibLandmark2.y);

  // Check the alignment by comparing the current distance with the calibrated distance
  return Math.abs(currentDist - calibDist) < ALIGNMENT_THRESHOLD;
};

const checkAnteriorPosture = (
  results: any,
  calibPositions: any,
  setIsAnteriorPosCorrect: any,
  setLandmarksVisible: any
) => {
  const lmPose = results.poseLandmarks;

  if (doLandmarksExist(lmPose, POSE_INDEXES_ANTERIOR)) {
    setLandmarksVisible(true);

    const leftShoulder = lmPose[POSE_LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = lmPose[POSE_LANDMARKS.RIGHT_SHOULDER];
    const leftEye = lmPose[POSE_LANDMARKS.LEFT_EYE];
    const rightEye = lmPose[POSE_LANDMARKS.RIGHT_EYE];

    // check alignment based on the calibrated positions
    const shoulderAlignment = checkAnteriorAlignment(
      leftShoulder,
      rightShoulder,
      calibPositions.leftShoulder.current,
      calibPositions.rightShoulder.current
    );
    const eyeAlignment = checkAnteriorAlignment(
      leftEye,
      rightEye,
      calibPositions.leftEye.current,
      calibPositions.rightEye.current
    );

    if (shoulderAlignment && eyeAlignment) {
      setIsAnteriorPosCorrect(true);
      return true;
    } else {
      setIsAnteriorPosCorrect(false);
    }
  } else {
    setLandmarksVisible(false);
  }

  return false;
};

export { PostureView, checkLateralPosture, checkAnteriorPosture };
