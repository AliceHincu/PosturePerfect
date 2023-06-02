import { OptionMap } from "@mediapipe/control_utils";

const config = {
  locateFile: (file: any) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@latest/${file}`;
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

export { config, initialConfig };
