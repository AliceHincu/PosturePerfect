import { Holistic, POSE_LANDMARKS } from "@mediapipe/holistic";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { ControlPanel, FPS, SourcePicker } from "@mediapipe/control_utils";
import { slider, toggle, text } from "../utils/control-factory";
import { canvasDimensions } from "../utils/dimensions";
import { Spinner } from "./ui/Spinner";
import { POSE_INDEXES_ANTERIOR, drawOnCanvas } from "../utils/canvas-utils";
import { config, initialConfig } from "../utils/holistic-utils";
import { PostureView, checkAnteriorPosture, checkLateralPosture, doLandmarksExist } from "../utils/posture-utils";

import { DropdownPosteriorView } from "./form/dropdowns/DropdownPosteriorView";

import { NotificationsForm } from "./form/NotificationsForm";
import {
  NotificationManager,
  NotificationMessage,
  NotificationValues,
  canNotifyPosture,
  sendNotification,
} from "./NotificationManager";
import { MINUTE_TO_SECONDS } from "./form/dropdowns/TimeField";

import "react-toastify/dist/ReactToastify.css";
import { ToastManager } from "./ToastManager";
import { ToastMessages, ToastType, generateToast } from "./ui/Toast";
import { PostureViewForm } from "./form/PostureViewForm";
import { PostureViewManager } from "./PostureCorrectionManager";

export const PoseAnalysis = () => {
  // references for video capturing and drawing
  const videoElement = useRef<HTMLVideoElement>(null);
  const canvasElement = useRef<HTMLCanvasElement>(null);
  const controlsElement = useRef<HTMLDivElement>(null);

  // notifications
  const initialValues: NotificationValues = {
    timeValuePosture: 5,
    timeUnitPosture: 1,
    timeValueBreak: 30,
    timeUnitBreak: +MINUTE_TO_SECONDS,
    timeValueWater: 30,
    timeUnitWater: +MINUTE_TO_SECONDS,
  };
  const [notificationValues, setNotificationValues] = useState<NotificationValues>(initialValues);
  const lastNotificationTime = useRef<Date | null>(null);

  // score
  let goodFrames = 0;
  let badFrames = 0;

  const [startCorrection, setStartCorrection] = useState(false);
  const startCorrectionRef = useRef(startCorrection);
  useEffect(() => {
    startCorrectionRef.current = startCorrection;
  }, [startCorrection]);

  const [postureView, setPostureView] = useState<PostureView>(PostureView.ANTERIOR); // to trigger re-renders from the dropdown
  const postureViewRef = useRef(postureView); // to always have the latest value for onResults
  // Update the ref whenever postureView changes
  useEffect(() => {
    postureViewRef.current = postureView;
    setStartCorrection(false);
  }, [postureView]);

  const [loading, setLoading] = useState(true);
  const [isLateralPosCorrect, setIsLateralPosCorrect] = useState(false);
  const [isAnteriorPosCorrect, setIsAnteriorPosCorrect] = useState(false);
  const [landmarksVisible, setLandmarksVisible] = useState(true);

  const soundPlayed = useRef(false);
  let activeEffect: any = "mask";

  // Refs for storing the calibration positions
  // Ref for storing the calibration positions
  const calibPositions = useRef<{
    leftShoulder: any;
    rightShoulder: any;
    leftEye: any;
    rightEye: any;
  }>({ leftShoulder: null, rightShoulder: null, leftEye: null, rightEye: null });
  const landmarks = useRef<any>(null);

  const onResults = (
    results: any,
    postureViewRef: any,
    startCorrectionRef: any,
    canvasCtx: CanvasRenderingContext2D,
    canvasElement: any,
    fpsControl: any,
    activeEffect: string
  ) => {
    fpsControl.tick(); // Update the frame rate.
    const currentPostureView = postureViewRef.current;
    landmarks.current = results.poseLandmarks;

    drawOnCanvas(results, currentPostureView, canvasCtx, canvasElement, activeEffect);
    if (startCorrectionRef.current) {
      if (postureView === PostureView.LATERAL) {
        if (!checkLateralPosture(goodFrames, badFrames, results, setIsLateralPosCorrect, setLandmarksVisible)) {
          // handleBadPosture();
        }
      } else {
        if (!checkAnteriorPosture(results, calibPositions, setIsAnteriorPosCorrect, setLandmarksVisible)) {
          if (canNotifyPosture(lastNotificationTime, notificationValues)) {
            sendNotification(NotificationMessage.POSTURE_ALERT);
          }
        }
      }
    }
  };

  useEffect(() => {
    if (canvasElement.current && controlsElement.current) {
      const canvasCtx: CanvasRenderingContext2D | null = canvasElement.current.getContext("2d");
      if (canvasCtx) {
        const fpsControl = new FPS();

        const holistic = new Holistic(config);
        holistic.onResults((results) => {
          setLoading(false);
          onResults(
            results,
            postureViewRef,
            startCorrectionRef,
            canvasCtx,
            canvasElement.current,
            fpsControl,
            activeEffect
          );
        });

        // Present a control panel through which the user can manipulate the solution options.
        new ControlPanel(controlsElement.current, initialConfig)
          .add([
            text("MediaPipe Holistic"),
            fpsControl,
            toggle("Selfie Mode", "selfieMode"),

            new SourcePicker({
              onSourceChanged: () => {
                // Resets because the pose gives better results when reset between source changes.
                holistic.reset();
              },
              onFrame: async (input, size) => {
                const { width, height } = canvasDimensions(size);
                if (canvasElement.current) {
                  canvasElement.current.width = width;
                  canvasElement.current.height = height;
                }
                await holistic.send({ image: input });
              },
            }),
            slider("Model Complexity", "modelComplexity", undefined, undefined, ["Lite", "Full", "Heavy"]),
            toggle("Smooth Landmarks", "smoothLandmarks"),
            toggle("Enable Segmentation", "enableSegmentation"),
            toggle("Smooth Segmentation", "smoothSegmentation"),
            slider("Min Detection Confidence", "minDetectionConfidence", [0, 1], 0.01),
            slider("Min Tracking Confidence", "minTrackingConfidence", [0, 1], 0.01),
            slider("Effect", "effect", undefined, undefined, { background: "Background", mask: "Foreground" }),
          ])
          .on((x) => {
            const options = x;
            //@ts-ignore
            videoElement.current.classList.toggle("selfie", options.selfieMode);
            activeEffect = x["effect"];
            holistic.setOptions(options);
          });
      }
    }
  }, []);

  const handleFormSubmit = (values: NotificationValues) => {
    setNotificationValues(values);
    generateToast(ToastMessages.FORM_SUBMITTED, ToastType.Info);
  };

  return (
    <div>
      <ToastManager
        postureView={postureView}
        isLateralPosCorrect={isLateralPosCorrect}
        landmarksVisible={landmarksVisible}
      />
      <div className="container">
        <video ref={videoElement} className="input_video"></video>
        <div className="canvas-container">
          <canvas ref={canvasElement} className="output_canvas" width="1280px" height="720px">
            {" "}
          </canvas>
        </div>
        <Spinner loading={loading}></Spinner>
        <div className="card-top">
          <PostureViewManager
            postureView={postureView}
            setPostureView={setPostureView}
            startCorrection={startCorrection}
            setStartCorrection={setStartCorrection}
            calibPositions={calibPositions}
            landmarks={landmarks}
          ></PostureViewManager>
        </div>

        <div className="card-bottom">
          <NotificationsForm initialValues={initialValues} handleFormSubmit={handleFormSubmit}></NotificationsForm>
          <NotificationManager notificationValues={notificationValues} />
        </div>
      </div>
      <div ref={controlsElement} className="control-panel"></div>
    </div>
  );
};
