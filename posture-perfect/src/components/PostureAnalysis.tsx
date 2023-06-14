import { useEffect, useRef, useState } from "react";
import { Pose } from "@mediapipe/pose";
import { ControlPanel, FPS, SourcePicker } from "@mediapipe/control_utils";
import { slider, toggle, text } from "../utils/control-factory";
import { canvasDimensions } from "../utils/dimensions";
import { Spinner } from "./ui/Spinner";
import { drawOnCanvas } from "../utils/canvas-utils";
import { poseConfig, initialConfig } from "../utils/pose-utils";
import {
  Thresholds,
  PostureView,
  checkAnteriorPosture,
  checkLateralPosture,
  initialThresholds,
} from "../utils/posture-utils";

import { NotificationsForm } from "./form/NotificationsForm";
import { NotificationManager, canNotifyPosture, sendNotification } from "./NotificationManager";

import "react-toastify/dist/ReactToastify.css";
import { ToastManager } from "./ToastManager";
import { ToastMessages, ToastType, generateToast } from "./ui/Toast";
import { PostureViewManager } from "./PostureViewManager";
import Webcam from "react-webcam";
import { NotificationMessage, NotificationValues, initialNotificationValues } from "../utils/notifications-utils";

export const PoseAnalysis = () => {
  // references for video capturing and drawing
  const webcamRef = useRef<Webcam>(null);
  const [deviceId, setDeviceId] = useState(""); // for the webcamera component
  const canvasElement = useRef<HTMLCanvasElement>(null);
  const controlsElement = useRef<HTMLDivElement>(null);

  // loading the canvas
  const [loading, setLoading] = useState(true);

  // notifications
  const [notificationValues, setNotificationValues] = useState<NotificationValues>(initialNotificationValues);
  const lastNotificationTime = useRef<Date | null>(null);

  // score
  let goodFrames = 0;
  let badFrames = 0;

  // Update the ref whenever startCorrection changes
  const [isLateralPosCorrect, setIsLateralPosCorrect] = useState(false);
  const [isAnteriorPosCorrect, setIsAnteriorPosCorrect] = useState(false);
  const [startAnalysis, setStartAnalysis] = useState(false);
  const correctionRef = useRef({
    isLateralPosCorrect: isLateralPosCorrect,
    isAnteriorPosCorrect: isAnteriorPosCorrect,
    startAnalysis: startAnalysis,
  });

  const setLateralPosition = (value: boolean) => {
    setIsLateralPosCorrect(value);
    correctionRef.current.isLateralPosCorrect = value;
  };
  const setAnteriorPosition = (value: boolean) => {
    setIsAnteriorPosCorrect(value);
    correctionRef.current.isAnteriorPosCorrect = value;
  };

  useEffect(() => {
    correctionRef.current.startAnalysis = startAnalysis; // to always have the latest value for onResults
    if (postureView == PostureView.LATERAL) {
      setLateralPosition(startAnalysis);
    } else {
      setAnteriorPosition(startAnalysis);
    }
  }, [startAnalysis]);

  // Update the ref whenever postureView changes
  const [postureView, setPostureView] = useState<PostureView>(PostureView.ANTERIOR); // to trigger re-renders from the dropdown
  const postureViewRef = useRef(postureView); // to always have the latest value for onResults
  useEffect(() => {
    postureViewRef.current = postureView;
    setStartAnalysis(false);
  }, [postureView]);

  // Ref for storing the calibration positions
  const calibPositions = useRef<{
    leftShoulder: any;
    rightShoulder: any;
    leftEye: any;
    rightEye: any;
  }>({ leftShoulder: null, rightShoulder: null, leftEye: null, rightEye: null });

  // thresholds
  const [thresholds, setThresholds] = useState<Thresholds>(initialThresholds);
  const thresholdsRef = useRef(thresholds);

  useEffect(() => {
    console.log(thresholds);
    thresholdsRef.current = thresholds;
  }, [thresholds]);

  // landmarks
  const landmarks = useRef<any>(null);
  const [landmarksVisible, setLandmarksVisible] = useState(true);
  const drawLandmarks = (
    results: any,
    postureView: PostureView,
    correctionRef: any,
    canvasCtx: CanvasRenderingContext2D,
    canvasElement: any
  ) => {
    if (postureView === PostureView.LATERAL) {
      drawOnCanvas(
        results,
        postureViewRef.current,
        canvasCtx,
        canvasElement,
        correctionRef.current.isLateralPosCorrect
      );
    } else {
      drawOnCanvas(
        results,
        postureViewRef.current,
        canvasCtx,
        canvasElement,
        correctionRef.current.isAnteriorPosCorrect
      );
    }
  };

  // camera stuff
  const [webcamSize, setWebcamSize] = useState({ width: 1280, height: 720 });
  const [selfieMode, setSelfieMode] = useState(true);

  // ========================
  const onResults = (
    results: any,
    postureViewRef: any,
    correctionRef: any,
    thresholdsRef: any,
    canvasCtx: CanvasRenderingContext2D,
    canvasElement: any,
    fpsControl: any
  ) => {
    fpsControl.tick(); // Update the frame rate.
    landmarks.current = results.poseLandmarks;
    drawLandmarks(results, postureViewRef.current, correctionRef, canvasCtx, canvasElement);

    if (correctionRef.current.startAnalysis) {
      if (postureViewRef.current === PostureView.LATERAL) {
        if (
          !checkLateralPosture(
            goodFrames,
            badFrames,
            results,
            thresholdsRef,
            setIsLateralPosCorrect,
            setLandmarksVisible
          )
        ) {
          // handleBadPosture();
        }
      } else {
        if (!checkAnteriorPosture(results, calibPositions, thresholdsRef, setAnteriorPosition, setLandmarksVisible)) {
          if (canNotifyPosture(lastNotificationTime, notificationValues)) {
            sendNotification(NotificationMessage.POSTURE_ALERT);
          }
        }
      }
    }
  };

  useEffect(() => {
    if (canvasElement.current && controlsElement.current && webcamRef.current) {
      const canvasCtx: CanvasRenderingContext2D | null = canvasElement.current.getContext("2d");
      if (canvasCtx) {
        const fpsControl = new FPS();

        const pose = new Pose(poseConfig);
        pose.onResults((results) => {
          setLoading(false);
          onResults(
            results,
            postureViewRef,
            correctionRef,
            thresholdsRef,
            canvasCtx,
            canvasElement.current,
            fpsControl
          );
        });

        // Present a control panel through which the user can manipulate the solution options.
        new ControlPanel(controlsElement.current, initialConfig)
          .add([
            text("MediaPipe Pose"),
            fpsControl,
            toggle("Selfie Mode", "selfieMode"),

            new SourcePicker({
              // onSourceChanged: async (name: string) => {
              //   // Resets because the pose gives better results when reset between source changes.
              //   setDeviceId(name);
              //   holistic.reset();
              // },
              onFrame: async (input, size) => {
                const { width, height } = canvasDimensions(size);
                if (canvasElement.current) {
                  canvasElement.current.width = width;
                  canvasElement.current.height = height;
                }
                if (pose) {
                  await pose.send({ image: input });
                }
              },
            }),
            slider("Model Complexity", "modelComplexity", undefined, undefined, ["Lite", "Full", "Heavy"]),
            toggle("Smooth Landmarks", "smoothLandmarks"),
            toggle("Enable Segmentation", "enableSegmentation"),
            toggle("Smooth Segmentation", "smoothSegmentation"),
            slider("Min Detection Confidence", "minDetectionConfidence", [0, 1], 0.01),
            slider("Min Tracking Confidence", "minTrackingConfidence", [0, 1], 0.01),
          ])
          .on((x) => {
            const options = x;
            //@ts-ignore
            setSelfieMode(options.selfieMode);
            pose.setOptions(options);
          });
      }
    }
  }, []);

  const handleFormSubmit = (values: NotificationValues) => {
    setNotificationValues(values);
    generateToast(ToastMessages.FORM_SUBMITTED, ToastType.Info);
  };

  const videoConstraints = {
    aspectRatio: 4 / 3, // 4:3
    facingMode: "user",
    width: { min: 256 },
    height: { min: 144 },
    deviceId: deviceId ? { exact: deviceId } : undefined,
  };

  useEffect(() => {
    const handleResize = () => {
      const aspect = videoConstraints.aspectRatio;
      let width, height;

      if (window.innerWidth > window.innerHeight) {
        height = window.innerHeight;
        width = height * aspect;
      } else {
        width = window.innerWidth;
        height = width / aspect;
      }
      setWebcamSize({ width, height });
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <ToastManager
        postureView={postureView}
        isLateralPosCorrect={isLateralPosCorrect}
        landmarksVisible={landmarksVisible}
      />
      <div
        style={{
          backgroundColor: "#596e73",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 10%", // Padding 10% on left and right
          height: "100vh",
          boxSizing: "border-box", // Include padding in height calculation
        }}
      >
        <Webcam
          ref={webcamRef}
          videoConstraints={{
            aspectRatio: 4 / 3, // 4:3
            facingMode: "user",
            width: { min: 256 },
            height: { min: 144 },
            deviceId: deviceId ? { exact: deviceId } : undefined,
          }}
          mirrored={selfieMode}
          audio={false}
          width={webcamSize.width}
          height={webcamSize.height}
          style={{
            visibility: loading ? "hidden" : "visible",
            position: "absolute",
            textAlign: "center",
            zIndex: 1,
          }}
        />
        <canvas
          ref={canvasElement}
          style={{
            position: "absolute",
            textAlign: "center",
            zIndex: 2,
          }}
        ></canvas>
      </div>
      <div className="container">
        <Spinner loading={loading}></Spinner>
      </div>
      <div ref={controlsElement} className="control-panel"></div>
      <div className="card-top">
        <PostureViewManager
          postureView={postureView}
          setPostureView={setPostureView}
          startCorrection={startAnalysis}
          setStartCorrection={setStartAnalysis}
          calibPositions={calibPositions}
          landmarks={landmarks}
          thresholds={thresholds}
          setThresholds={setThresholds}
        ></PostureViewManager>
      </div>
      <div className="card-bottom">
        <NotificationsForm handleFormSubmit={handleFormSubmit}></NotificationsForm>
        <NotificationManager notificationValues={notificationValues} />
      </div>
    </div>
  );
};
