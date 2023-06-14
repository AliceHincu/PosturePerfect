import { POSE_LANDMARKS } from "@mediapipe/pose";
import { findAngle, findDistance } from "./math-utils";
import { POSE_INDEXES_LATERAL, POSE_INDEXES_ANTERIOR } from "./canvas-utils";

enum PostureView {
  ANTERIOR = "anterior",
  LATERAL = "lateral",
}

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
const checkLateralCameraAlignment = (leftShoulder: any, rightShoulder: any, OFFSET_THRESHOLD: number) => {
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
const validateLateralCameraView = (
  lmPose: any,
  setIsLateralPositionGood: any,
  setAreLandmarksVisible: any,
  OFFSET_THRESHOLD: number
) => {
  if (doLandmarksExist(lmPose, POSE_INDEXES_LATERAL)) {
    setAreLandmarksVisible(true);
    const leftShoulder = lmPose[POSE_LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = lmPose[POSE_LANDMARKS.RIGHT_SHOULDER];
    if (checkLateralCameraAlignment(leftShoulder, rightShoulder, OFFSET_THRESHOLD)) {
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
  thresholdsRef: any,
  setIsLateralPositionGood: any,
  setAreLandmarksVisible: any
) => {
  const lmPose = results.poseLandmarks;

  if (
    validateLateralCameraView(
      lmPose,
      setIsLateralPositionGood,
      setAreLandmarksVisible,
      thresholdsRef.current.OFFSET_THRESHOLD
    )
  ) {
    const leftShoulder = lmPose[POSE_LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = lmPose[POSE_LANDMARKS.RIGHT_SHOULDER];
    const leftEar = lmPose[POSE_LANDMARKS.LEFT_EAR];
    const rightEar = lmPose[POSE_LANDMARKS.RIGHT_EAR];
    const leftHip = lmPose[POSE_LANDMARKS.LEFT_HIP];
    const rightHip = lmPose[POSE_LANDMARKS.RIGHT_HIP];

    // calculate angles.
    const neckInclination = findAngle(leftShoulder.x, leftShoulder.y, leftEar.x, leftEar.y);
    const torsoInclination = findAngle(leftHip.x, leftHip.y, leftShoulder.x, leftShoulder.y);

    if (
      neckInclination < thresholdsRef.current.NECK_INCLINATION_THRESHOLD &&
      torsoInclination < thresholdsRef.current.TORSO_INCLINATION_THRESHOLD
    ) {
      return true;
    }
  }
  return false;
};

/// ============================================================

const checkAnteriorAlignment = (
  currentLandmark1: any,
  currentLandmark2: any,
  calibLandmark1: any,
  calibLandmark2: any,
  threshold: number
) => {
  // Calculate the average y-coordinate for current and calibrated positions
  const currentAvgY = (currentLandmark1.y + currentLandmark2.y) / 2;
  const calibAvgY = (calibLandmark1.y + calibLandmark2.y) / 2;

  // Check the alignment by comparing the current average y-coordinate with the calibrated y-coordinate
  return Math.abs(currentAvgY - calibAvgY) < threshold;
};

const checkIfPersonIsTurned = (
  currentHead: any,
  currentShoulderLeft: any,
  currentShoulderRight: any,
  threshold: number
) => {
  // Calculate the average x-coordinate of the shoulders
  const avgShoulderX = (currentShoulderLeft.x + currentShoulderRight.x) / 2;

  // Check if the person is turned by comparing the x-coordinate of the head with the average x-coordinate of the shoulders
  const isTurned = Math.abs(currentHead.x - avgShoulderX) > threshold;

  return isTurned;
};

const checkAnteriorPosture = (
  results: any,
  calibPositions: any,
  thresholdsRef: any,
  setAnteriorPosition: any,
  setLandmarksVisible: any
) => {
  const lmPose = results.poseLandmarks;

  if (doLandmarksExist(lmPose, POSE_INDEXES_ANTERIOR)) {
    setLandmarksVisible(true);

    const leftShoulder = lmPose[POSE_LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = lmPose[POSE_LANDMARKS.RIGHT_SHOULDER];
    const leftEye = lmPose[POSE_LANDMARKS.LEFT_EYE];
    const rightEye = lmPose[POSE_LANDMARKS.RIGHT_EYE];
    const head = lmPose[POSE_LANDMARKS.NOSE];

    const isHeadTurned = checkIfPersonIsTurned(head, leftShoulder, rightShoulder, 0.05);

    // check alignment based on the calibrated positions
    console.log(thresholdsRef.current.ALIGNMENT_SHOULDERS_THRESHOLD_ANTERIOR);
    const shoulderAlignment = checkAnteriorAlignment(
      leftShoulder,
      rightShoulder,
      calibPositions.current.leftShoulder,
      calibPositions.current.rightShoulder,
      thresholdsRef.current.ALIGNMENT_SHOULDERS_THRESHOLD_ANTERIOR
    );
    const eyeAlignment = checkAnteriorAlignment(
      leftEye,
      rightEye,
      calibPositions.current.leftEye,
      calibPositions.current.rightEye,
      thresholdsRef.current.ALIGNMENT_EYES_THRESHOLD_ANTERIOR
    );

    if (!isHeadTurned) {
      if (eyeAlignment && shoulderAlignment) {
        setAnteriorPosition(true);
        return true;
      } else {
        setAnteriorPosition(false);
      }
    }
  } else {
    setLandmarksVisible(false);
  }

  return false;
};

export { PostureView, checkLateralPosture, checkAnteriorPosture };
