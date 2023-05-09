import { Holistic } from "@mediapipe/holistic";
import { useEffect, useRef, useState } from "react";
import { ControlPanel, FPS, SourcePicker } from "@mediapipe/control_utils";
import { slider, toggle, text } from "./control-panel/control-factory";
import { canvasDimensions } from "../utils/dimensions";
import { Spinner } from "./Spinner";
import { drawOnCanvas } from "../utils/canvas-utils";
import { config, initialConfig } from "../utils/holistic-utils";

export const PoseAnalysis = () => {
  const effectRan = useRef(false); // nullify first useEffect because of version 18.0.0
  const videoElement = useRef<HTMLVideoElement>(null);
  const canvasElement = useRef<HTMLCanvasElement>(null);
  const controlsElement = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);

  let activeEffect: any = "mask";

  const onResults = (
    results: any,
    canvasCtx: CanvasRenderingContext2D,
    canvasElement: any,
    fpsControl: any,
    activeEffect: string
  ) => {
    fpsControl.tick(); // Update the frame rate.
    drawOnCanvas(results, canvasCtx, canvasElement, activeEffect);
  };

  useEffect(() => {
    if (effectRan.current == true) {
      if (canvasElement.current && controlsElement.current) {
        const canvasCtx: CanvasRenderingContext2D | null = canvasElement.current.getContext("2d");
        if (canvasCtx) {
          const fpsControl = new FPS();

          const holistic = new Holistic(config);
          holistic.onResults((results) => {
            setLoading(false);
            onResults(results, canvasCtx, canvasElement.current, fpsControl, activeEffect);
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
    }
    return () => {
      effectRan.current = true;
    };
  }, []);

  return (
    <div>
      <div className="container">
        <video ref={videoElement} className="input_video"></video>
        <div className="canvas-container">
          <canvas ref={canvasElement} className="output_canvas" width="1280px" height="720px">
            {" "}
          </canvas>
        </div>
        <Spinner loading={loading}></Spinner>
      </div>
      <div ref={controlsElement} className="control-panel"></div>
    </div>
  );
};
