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

import sound from "../audio/stand_straight.mp3";
import { NotificationsForm } from "./form/NotificationsForm";
import { NotificationManager, NotificationValues } from "./NotificationManager";
import { MINUTE_TO_SECONDS } from "./form/dropdowns/TimeField";

import "react-toastify/dist/ReactToastify.css";
import { ToastManager } from "./ToastManager";
import { ToastMessages, ToastTypes, generateToast } from "./ui/Toast";
import { PostureViewForm } from "./form/PostureViewForm";

const humpAlert = () => {
  // sendNotification("alert!");
  // new Audio(sound).play();
};

export const PoseAnalysis = () => {
  const effectRan = useRef(false); // nullify first useEffect because of version 18.0.0
  const videoElement = useRef<HTMLVideoElement>(null);
  const canvasElement = useRef<HTMLCanvasElement>(null);
  const controlsElement = useRef<HTMLDivElement>(null);

  const [postureView, setPostureView] = useState<PostureView>(PostureView.ANTERIOR); // to trigger re-renders from the dropdown
  const postureViewRef = useRef(postureView); // to always have the latest value for onResults
  // Update the ref whenever postureView changes
  useEffect(() => {
    postureViewRef.current = postureView;
  }, [postureView]);

  const [loading, setLoading] = useState(true);
  const [isLateralPosCorrect, setIsLateralPosCorrect] = useState(false);
  const [isAnteriorPosCorrect, setIsAnteriorPosCorrect] = useState(false);
  // const toastIdLateralPositionCorrect = useRef<Id | null>(null);
  const [landmarksVisible, setLandmarksVisible] = useState(true);
  // const toastIdAreLandmarksVisible = useRef<Id | null>(null);

  const soundPlayed = useRef(false);
  let activeEffect: any = "mask";

  // notifications
  const initialValues: NotificationValues = {
    timeValueAlert: 30,
    timeUnitAlert: 1,
    timeValueBreak: 30,
    timeUnitBreak: +MINUTE_TO_SECONDS,
    timeValueWater: 30,
    timeUnitWater: +MINUTE_TO_SECONDS,
  };
  const [notificationValues, setNotificationValues] = useState<NotificationValues>(initialValues);

  // posture score
  let goodFrames = 0;
  let badFrames = 0;

  // Refs for storing the calibration positions
  // Ref for storing the calibration positions
  const calibPositions = useRef<{
    leftShoulder: any;
    rightShoulder: any;
    leftEye: any;
    rightEye: any;
  }>({ leftShoulder: null, rightShoulder: null, leftEye: null, rightEye: null });
  const landmarks = useRef<any>(null);
  // const handleBadPosture = () => {
  //   if (soundPlayed.current) return;
  //   humpAlert();
  //   soundPlayed.current = true;
  //   setTimeout(() => {
  //     soundPlayed.current = false;
  //   }, 5000);
  // };

  const onResults = (
    results: any,
    postureViewRef: any,
    canvasCtx: CanvasRenderingContext2D,
    canvasElement: any,
    fpsControl: any,
    activeEffect: string
  ) => {
    fpsControl.tick(); // Update the frame rate.
    const currentPostureView = postureViewRef.current;
    landmarks.current = results.poseLandmarks;

    drawOnCanvas(results, currentPostureView, canvasCtx, canvasElement, activeEffect);
    // if (postureView === PostureView.LATERAL) {
    //   if (!checkLateralPosture(goodFrames, badFrames, results, setIsLateralPosCorrect, setLandmarksVisible)) {
    //     handleBadPosture();
    //   }
    // } else {
    //   checkAnteriorPosture(results, calibPositions, setIsAnteriorPosCorrect, setLandmarksVisible);
    // }
  };

  useEffect(() => {
    if (canvasElement.current && controlsElement.current) {
      const canvasCtx: CanvasRenderingContext2D | null = canvasElement.current.getContext("2d");
      if (canvasCtx) {
        const fpsControl = new FPS();

        const holistic = new Holistic(config);
        holistic.onResults((results) => {
          setLoading(false);
          onResults(results, postureViewRef, canvasCtx, canvasElement.current, fpsControl, activeEffect);
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
    generateToast(ToastMessages.FORM_SUBMITTED, ToastTypes.Info);
  };

  // Wrapper function that calls calibratePosture with the correct arguments
  const handleCalibration = () => {
    calibratePosture(landmarks.current);
  };

  const calibratePosture = (lmPose: any) => {
    if (doLandmarksExist(lmPose, POSE_INDEXES_ANTERIOR)) {
      calibPositions.current.leftShoulder = lmPose[POSE_LANDMARKS.LEFT_SHOULDER];
      calibPositions.current.rightShoulder = lmPose[POSE_LANDMARKS.RIGHT_SHOULDER];
      calibPositions.current.leftEye = lmPose[POSE_LANDMARKS.LEFT_EYE];
      calibPositions.current.rightEye = lmPose[POSE_LANDMARKS.RIGHT_EYE];
    }
    console.log(calibPositions.current);
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
          <PostureViewForm
            postureView={postureView}
            setPostureView={setPostureView}
            calibratePosture={handleCalibration}
          ></PostureViewForm>
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
