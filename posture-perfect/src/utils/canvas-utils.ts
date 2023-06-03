import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { POSE_CONNECTIONS, POSE_LANDMARKS } from "@mediapipe/pose";
import { PostureView } from "./posture-utils";

// -- landmark indexes
const TOTAL_POSE_LANDMARKS = 33;
const POSE_INDEXES_LATERAL_LEFT = [POSE_LANDMARKS.LEFT_EAR, POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_HIP];
const POSE_INDEXES_LATERAL_RIGHT = [POSE_LANDMARKS.RIGHT_EAR, POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_HIP];
const POSE_INDEXES_ANTERIOR_LEFT = [POSE_LANDMARKS.LEFT_EYE, POSE_LANDMARKS.LEFT_SHOULDER];
const POSE_INDEXES_ANTERIOR_RIGHT = [POSE_LANDMARKS.RIGHT_EYE, POSE_LANDMARKS.RIGHT_SHOULDER];
export const POSE_INDEXES_LATERAL = [...POSE_INDEXES_LATERAL_LEFT, ...POSE_INDEXES_LATERAL_RIGHT];
export const POSE_INDEXES_ANTERIOR = [
  ...POSE_INDEXES_ANTERIOR_LEFT,
  ...POSE_INDEXES_ANTERIOR_RIGHT,
  POSE_LANDMARKS.NOSE,
];
const allIndices = Array.from({ length: TOTAL_POSE_LANDMARKS }, (_, index) => index); // generates [0, 1, ..., 32]
const indicesToRemoveLateral = allIndices.filter((index) => !POSE_INDEXES_LATERAL.includes(index));
const indicesToRemoveAnterior = allIndices.filter((index) => !POSE_INDEXES_ANTERIOR.includes(index));

// -- colors of landmarks on canvas
const LEFT_COLOR = "rgb(0,217,231)";
const RIGHT_COLOR = "rgb(255,138,0)";
const NOSE_COLOR = "white";

/**
 * Remove given elements from object
 * @param obj
 * @param elements
 */
function removeElements(obj: any, elements: any) {
  for (const element of elements) {
    delete obj[element];
  }
}

/**
 * Remove landmarks we don't want to draw.
 * For lateral, we only want the ears, the shoulders, and the hips to be drawn
 * For anterior, we only want the eyes and the shoulders
 * @param results poseLandmarks from mediapipe
 * @param {PostureView} postureView
 */
const removeLandmarks = (results: any, postureView: PostureView) => {
  if (results.poseLandmarks) {
    if (postureView === PostureView.LATERAL) removeElements(results.poseLandmarks, indicesToRemoveLateral);
    else removeElements(results.poseLandmarks, indicesToRemoveAnterior);
  }
};

/**
 * Draw the given landmarks on the canvas
 * @param canvasCtx context of canvas
 * @param landmarkIndexes the indexes of the landmarks that need to be drawn
 * @param landmarks mediapipe results.poseLandmarks
 * @param fillColor color of the circles of the joints
 */
const drawLandmarksOnCanvas = (
  canvasCtx: CanvasRenderingContext2D,
  landmarkIndexes: number[],
  landmarks: any,
  fillColor: string
) => {
  drawLandmarks(
    canvasCtx,
    landmarkIndexes.map((index) => landmarks[index]),
    { visibilityMin: 0.65, color: "white", fillColor }
  );
};

const drawSegmentationMask = (canvasCtx: CanvasRenderingContext2D, results: any, canvasElement: any) => {
  canvasCtx.drawImage(results.segmentationMask, 0, 0, canvasElement.width, canvasElement.height);

  // Only overwrite existing pixels.
  canvasCtx.globalCompositeOperation = "source-in";
  // This can be a color or a texture or whatever...
  canvasCtx.fillStyle = "#00FF007F";
  canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

  // Only overwrite missing pixels.
  canvasCtx.globalCompositeOperation = "destination-atop";
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.globalCompositeOperation = "source-over";
};

const drawOnCanvas = (
  results: any,
  postureView: PostureView,
  canvasCtx: CanvasRenderingContext2D,
  canvasElement: any
) => {
  removeLandmarks(results, postureView);

  // Draw the overlays.
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  if (results.segmentationMask) {
    drawSegmentationMask(canvasCtx, results, canvasElement);
  } else {
    // canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
  }

  // Pose...
  drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
    color: "white",
  });
  if (postureView === PostureView.LATERAL) {
    drawLandmarksOnCanvas(canvasCtx, POSE_INDEXES_LATERAL_RIGHT, results.poseLandmarks, RIGHT_COLOR);
    drawLandmarksOnCanvas(canvasCtx, POSE_INDEXES_LATERAL_LEFT, results.poseLandmarks, LEFT_COLOR);
  } else {
    drawLandmarksOnCanvas(canvasCtx, POSE_INDEXES_ANTERIOR_RIGHT, results.poseLandmarks, RIGHT_COLOR);
    drawLandmarksOnCanvas(canvasCtx, POSE_INDEXES_ANTERIOR_LEFT, results.poseLandmarks, LEFT_COLOR);
    drawLandmarksOnCanvas(canvasCtx, [POSE_LANDMARKS.NOSE], results.poseLandmarks, NOSE_COLOR);
  }

  canvasCtx.restore();
};

export { removeLandmarks, drawOnCanvas };
