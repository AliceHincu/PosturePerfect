import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { PostureView, doLandmarksExist } from "../utils/posture-utils";
import { PostureViewForm } from "./form/PostureViewForm";
import { POSE_INDEXES_ANTERIOR } from "../utils/canvas-utils";
import { POSE_LANDMARKS } from "@mediapipe/holistic";
import { ToastMessages, ToastType, generateToast } from "./ui/Toast";
import { useAppSelector } from "../redux/hooks";

interface PostureCorrectionProps {
  startCorrection: boolean;
  setStartCorrection: Dispatch<SetStateAction<boolean>>;
  calibPositions: any;
}

export const PostureViewManager = (props: PostureCorrectionProps) => {
  const postureView = useAppSelector((state) => state.posture.postureView);

  const { startCorrection, setStartCorrection, calibPositions } = props;

  const [isCalibrationGood, setIsCalibrationGood] = useState(false);
  const poseLm = useAppSelector((state) => state.posture.poseLandmarks);

  /**
   * Check if all the landmarks are calibrated correctly
   * @returns {boolean}
   */
  const checkCalibrations = (): boolean => {
    return (
      !calibPositions.current.leftShoulder ||
      !calibPositions.current.rightShoulder ||
      !calibPositions.current.leftEye ||
      !calibPositions.current.rightEye
    );
  };

  /**
   * Wrapper function that calls calibratePosture with the correct arguments
   */
  const handleCalibration = () => {
    calibratePosture(poseLm);
  };

  /**
   * Memorize the values of the landmarks when the calibrate button is clicked, if they can all be seen on the screen
   * @param lmPose
   */
  const calibratePosture = (lmPose: any) => {
    if (poseLm && doLandmarksExist(poseLm, POSE_INDEXES_ANTERIOR)) {
      calibPositions.current.leftShoulder = lmPose[POSE_LANDMARKS.LEFT_SHOULDER];
      calibPositions.current.rightShoulder = lmPose[POSE_LANDMARKS.RIGHT_SHOULDER];
      calibPositions.current.leftEye = lmPose[POSE_LANDMARKS.LEFT_EYE];
      calibPositions.current.rightEye = lmPose[POSE_LANDMARKS.RIGHT_EYE];
      generateToast(ToastMessages.CALIBRATED, ToastType.Info);
      setIsCalibrationGood(true);
    } else {
      generateToast(ToastMessages.LANDMARKS_NOT_VISIBLE, ToastType.Warning);
    }
  };

  /**
   * Start analyzing the posture if all the conditions are met
   */
  const startPostureCorrection = () => {
    if (postureView === PostureView.ANTERIOR) {
      if (checkCalibrations()) {
        generateToast(ToastMessages.NOT_CALIBRATED, ToastType.Warning);
      } else {
        setStartCorrection(true);
        generateToast(ToastMessages.STARTED_CORRECTION, ToastType.Info);
      }
    }
  };

  /**
   * Stop analyzing the posture if all the conditions are met
   */
  const stopPostureCorrection = () => {
    if (postureView === PostureView.ANTERIOR) {
      setIsCalibrationGood(false);
    }
    setStartCorrection(false);
    generateToast(ToastMessages.STOPPED_CORRECTION, ToastType.Info);
  };

  return (
    <PostureViewForm
      calibratePosture={handleCalibration}
      startCorrection={startCorrection}
      startPostureCorrection={startPostureCorrection}
      stopPostureCorrection={stopPostureCorrection}
      disableStart={!isCalibrationGood}
    ></PostureViewForm>
  );
};
