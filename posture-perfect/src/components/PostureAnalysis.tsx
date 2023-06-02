import { Holistic } from "@mediapipe/holistic";
import { useEffect, useRef, useState } from "react";
import { ControlPanel, FPS, SourcePicker } from "@mediapipe/control_utils";
import { slider, toggle, text } from "../utils/control-factory";
import { canvasDimensions } from "../utils/dimensions";
import { Spinner } from "./ui/Spinner";
import { drawOnCanvas } from "../utils/canvas-utils";
import { config, initialConfig } from "../utils/holistic-utils";
import { PostureView, checkAnteriorPosture, checkLateralPosture } from "../utils/posture-utils";

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
import { PostureViewManager } from "./PostureViewManager";
import Webcam from "react-webcam";

export const PoseAnalysis = () => {
  // references for video capturing and drawing
  const videoElement = useRef<HTMLVideoElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const canvasElement = useRef<HTMLCanvasElement>(null);
  const controlsElement = useRef<HTMLDivElement>(null);

  // loading the canvas
  const [loading, setLoading] = useState(true);

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

  // Update the ref whenever startCorrection changes
  const [startAnalysis, setStartAnalysis] = useState(false);
  const startCorrectionRef = useRef(startAnalysis);
  useEffect(() => {
    startCorrectionRef.current = startAnalysis; // to always have the latest value for onResults
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

  const landmarks = useRef<any>(null);
  const [isLateralPosCorrect, setIsLateralPosCorrect] = useState(false);
  const [isAnteriorPosCorrect, setIsAnteriorPosCorrect] = useState(false);
  const [landmarksVisible, setLandmarksVisible] = useState(true);

  const [webcamSize, setWebcamSize] = useState({ width: 1280, height: 720 });
  const [selfieMode, setSelfieMode] = useState(true);

  const onResults = (
    results: any,
    postureViewRef: any,
    startCorrectionRef: any,
    canvasCtx: CanvasRenderingContext2D,
    canvasElement: any,
    fpsControl: any
  ) => {
    fpsControl.tick(); // Update the frame rate.
    landmarks.current = results.poseLandmarks;
    drawOnCanvas(results, postureViewRef.current, canvasCtx, canvasElement);

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
          onResults(results, postureViewRef, startCorrectionRef, canvasCtx, canvasElement.current, fpsControl);
        });

        // Present a control panel through which the user can manipulate the solution options.
        new ControlPanel(controlsElement.current, initialConfig)
          .add([
            text("MediaPipe Holistic"),
            fpsControl,
            toggle("Selfie Mode", "selfieMode"),

            new SourcePicker({
              onSourceChanged: async (name: string) => {
                // Resets because the pose gives better results when reset between source changes.
                console.log(name);
                holistic.reset();

                // // Request a MediaStream from the new camera.
                // const stream = await navigator.mediaDevices.getUserMedia({
                //   video: {
                //     deviceId: { exact: name },
                //   },
                // });

                // // Assign the MediaStream to the video element and start playing the video.
                // if (videoElement.current) {
                //   videoElement.current.srcObject = stream;
                //   videoElement.current.play();
                // }
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
          ])
          .on((x) => {
            const options = x;
            //@ts-ignore
            // videoElement.current.classList.toggle("selfie", options.selfieMode);
            setSelfieMode(options.selfieMode);
            holistic.setOptions(options);
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
      // if (canvasElement.current) {
      //   canvasElement.current.width = width;
      //   canvasElement.current.height = height;
      // }
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
          videoConstraints={videoConstraints}
          mirrored={selfieMode}
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
        {/* <video ref={videoElement} className="input_video"></video> */}
        {/* <div className="canvas-container">
          <canvas ref={canvasElement} className="output_canvas" width="1280px" height="720px">
            {" "}
          </canvas>
        </div> */}
        <Spinner loading={loading}></Spinner>
        {/* <div className="card-top">
          <PostureViewManager
            postureView={postureView}
            setPostureView={setPostureView}
            startCorrection={startAnalysis}
            setStartCorrection={setStartAnalysis}
            calibPositions={calibPositions}
            landmarks={landmarks}
          ></PostureViewManager>
        </div>

        <div className="card-bottom">
          <NotificationsForm initialValues={initialValues} handleFormSubmit={handleFormSubmit}></NotificationsForm>
          <NotificationManager notificationValues={notificationValues} />
        </div> */}
      </div>
      <div ref={controlsElement} className="control-panel"></div>
    </div>
  );
};
