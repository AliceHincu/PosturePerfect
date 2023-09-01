import React, { useState, useEffect, useRef } from "react";
import { VideoHandler } from "./video/VideoHandler";
import { CanvasHandler } from "./canvas/CanvasHandler";
import { Landmark } from "@mediapipe/pose";
import { PostureProcessingController } from "./controllers/PostureProcessingController";
import { PoseModelController } from "./controllers/PoseModelController";
import { initialConfig } from "../utils/model-utils";
import { usePoseEstimation } from "./video/PoseEstimator";
import { canNotifyPosture, sendNotification } from "./NotificationManager";
import { NotificationValues, initialNotificationValues } from "../utils/notifications-utils";
import { NotificationController } from "./controllers/NotificationController";
import useCamera from "../hooks/useCamera";
import { useWebSocket } from "../hooks/useWebsocket";

export interface LandmarkDict {
  [x: number]: Landmark;
}
export type ErrorDetails = {
  elbowsTooFar: boolean | null;
  userTooClose: boolean | null;
  userLeaning: boolean | null;
  shouldersHunched: boolean | null;
  headHunched: boolean | null;
};
export interface ResponseData {
  error: boolean;
  message: string;
  details?: ErrorDetails;
}

export const PostureProcessing = () => {
  // video related
  const videoRef = useRef<HTMLVideoElement>(null);
  const { devices, deviceId, setDeviceId, onUserMedia } = useCamera();

  // notifications
  const lastNotificationTime = useRef<Date | null>(null);
  const [notificationValues, setNotificationValues] = useState<NotificationValues>(initialNotificationValues);

  const triggerPostureAlert = (message: string) => {
    if (canNotifyPosture(lastNotificationTime, notificationValues)) {
      sendNotification(message);
    }
  };

  // websocket related
  const {
    poseResultsRef,
    getPoseResults,
    isEstimationStarted,
    setIsEstimationStarted,
    selectedPostureView,
    setPostureView,
    setCalibration,
    setScore,
    setStarted,
    setThresholdStrictness,
    areButtonsDisabled,
    circleRefs,
  } = useWebSocket(triggerPostureAlert);

  // fps
  const increaseFrameCountRef = useRef<(() => void) | null>(null);
  const onFrameResult = (results: any) => {
    poseResultsRef.current = results;
    if (increaseFrameCountRef.current) {
      increaseFrameCountRef.current();
    }
  };

  // pose model
  const { initializeModel, modelLoading, setPoseConfig, poseConfig } = usePoseEstimation({
    videoRef,
    onFrameResult,
  });
  useEffect(() => {
    initializeModel(initialConfig);
  }, []);

  // loading logic
  const [videoLoading, setVideoLoading] = useState(true);
  const [isFrozen, setIsFrozen] = useState(false);
  useEffect(() => {
    setIsFrozen(videoLoading || modelLoading);
  }, [videoLoading, modelLoading]);

  return (
    <div className="App">
      <div className="posture-processing-container">
        <PoseModelController
          onConfigChange={function (config: any): any {
            setPoseConfig(config);
          }}
          increaseFrameCountRef={increaseFrameCountRef}
          isEstimationStarted={isEstimationStarted}
          devices={devices}
          setDeviceId={setDeviceId}
        ></PoseModelController>
        <PostureProcessingController
          isEstimationStarted={isEstimationStarted}
          setIsEstimationStarted={setIsEstimationStarted}
          selectedPostureView={selectedPostureView}
          setSelectedPostureView={setPostureView}
          setCalibration={setCalibration}
          setThresholdStrictness={setThresholdStrictness}
          setStarted={setStarted}
          setScore={setScore}
          areButtonsDisabled={areButtonsDisabled}
          videoRef={videoRef}
          circleRefs={circleRefs}
        ></PostureProcessingController>
        <NotificationController
          notificationValues={notificationValues}
          setNotificationValues={setNotificationValues}
        ></NotificationController>
        <VideoHandler
          deviceId={deviceId}
          onUserMedia={onUserMedia}
          videoRef={videoRef}
          poseConfig={poseConfig}
          isFrozen={isFrozen}
          setVideoLoading={setVideoLoading}
        ></VideoHandler>
        <CanvasHandler getPoseResults={getPoseResults} videoRef={videoRef} isFrozen={isFrozen} />
      </div>
    </div>
  );
};
