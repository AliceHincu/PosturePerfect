import { OptionMap } from "@mediapipe/control_utils";

const modelConfig = {
  locateFile: (file: any) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@latest/${file}`;
  },
};

const initialConfig: OptionMap = {
  selfieMode: true,
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: false,
  smoothSegmentation: false,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
};

export { modelConfig, initialConfig };
