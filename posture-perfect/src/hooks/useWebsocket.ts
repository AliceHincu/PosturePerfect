import { useRef, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { ErrorDetails, ResponseData } from "../components/PostureProcessing";
import { ToastType, generateToast } from "../components/ui/Toast";
import { useToastManager } from "./useToastManager";
import { PostureView, extractLandmarks, ThresholdStrictness } from "../utils/posture-utils";
import { useCircleColors } from "./useCircleColors";
import { useAuth } from "../context/authContext";

export const useWebSocket = (
  triggerPostureAlert: (message: string) => void
  // Add other update functions here
) => {
  const [isEstimationStarted, setIsEstimationStarted] = useState(false);
  const [selectedPostureView, setSelectedPostureView] = useState<PostureView>(PostureView.ANTERIOR);
  const [areButtonsDisabled, setAreButtonsDisabled] = useState<boolean>(false);

  const socket = useRef<Socket | null>(null);
  const poseResultsRef = useRef<any>(null);
  const { circleRefs, updateCircleColors } = useCircleColors(isEstimationStarted);
  const { token } = useAuth();

  const { updateCameraAnteriorToast, updateCalibrationSettingsToast, updatePostureViewToast, updateThresholdsToast } =
    useToastManager();

  const setPostureView = (postureView: PostureView) => {
    setSelectedPostureView(postureView);
    if (socket.current) {
      socket.current.emit("setPostureView", postureView);
    }
  };

  const setCalibration = () => {
    if (socket.current) {
      socket.current.emit(
        "setCalibration",
        extractLandmarks(selectedPostureView, poseResultsRef.current.poseLandmarks)
      );
    }
  };

  const setThresholdStrictness = (strictness: ThresholdStrictness) => {
    if (socket.current) {
      console.log(strictness);
      socket.current.emit("setThresholdStrictness", strictness);
    }
  };

  const setScore = () => {
    if (socket.current) {
      socket.current.emit("setScore", token);
    }
  };

  const setStarted = () => {
    if (socket.current) {
      socket.current.emit("setStarted");
    }
  };

  const getPoseResults = () => {
    if (!poseResultsRef.current || !poseResultsRef.current.poseLandmarks) return null;

    let landmarks = extractLandmarks(selectedPostureView, poseResultsRef.current.poseLandmarks);

    if (socket.current) {
      // todo(backend): calculate the turning of the head based on angles not positions
      if (isEstimationStarted) {
        socket.current.emit("analyzePosture", landmarks);
      } else {
        socket.current.emit("analyzeCamera", landmarks);
      }
    }
    return landmarks;
  };

  useEffect(() => {
    console.log("hi");
    if (!socket.current) {
      console.log("hiiiiii");
      socket.current = io("http://localhost:8080");

      socket.current.on("connect", () => {
        console.log("connected to server");
      });

      socket.current.on("poseDataProcessed", (data: ResponseData) => {
        updateCircleColors(data.details as ErrorDetails);
        if (data.error) triggerPostureAlert(data.message);
      });

      socket.current.on("cameraProcessed", (data: ResponseData) => {
        updateCameraAnteriorToast(data.error, data.message, ToastType.Error);
        setAreButtonsDisabled(data.error);
      });

      socket.current.on("postureViewProcessed", (data: ResponseData) => {
        updatePostureViewToast(data.message, data.error ? ToastType.Warning : ToastType.Info);
      });

      socket.current.on("calibrationProcessed", (data: ResponseData) => {
        updateCalibrationSettingsToast(data.message, data.error ? ToastType.Warning : ToastType.Info);
      });

      socket.current.on("thresholdsProcessed", (data: ResponseData) => {
        updateThresholdsToast(data.message, data.error ? ToastType.Warning : ToastType.Info);
      });

      socket.current.on("scoreProcessed", (data: ResponseData) => {
        if (data.error) {
          generateToast("Score could not be computed.", ToastType.Info);
          return;
        }
        if (token) {
          generateToast("Your score is: " + data.message + "%. It was saved in the calendar.", ToastType.Info);
        } else {
          generateToast(
            "Your score is: " + data.message + "%. Create an account to save futures scores in the calendar.",
            ToastType.Info
          );
        }
      });
    }

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, []);

  return {
    poseResultsRef,
    getPoseResults,
    isEstimationStarted,
    setIsEstimationStarted,
    selectedPostureView,
    setPostureView,
    setCalibration,
    setStarted,
    setScore,
    setThresholdStrictness,
    areButtonsDisabled,
    circleRefs,
  }; // you can return this ref if needed in your component
};
