import { drawConnectors, drawLandmarks, lerp } from "@mediapipe/drawing_utils";
import { POSE_CONNECTIONS } from "@mediapipe/holistic";

// -- landmark indexes
const POSE_INDEXES_LATERAL_LEFT = [7, 11, 23]; // ears + shoulders + hips
const POSE_INDEXES_LATERAL_RIGHT = [8, 12, 24];
export const POSE_INDEXES_LATERAL = [...POSE_INDEXES_LATERAL_LEFT, ...POSE_INDEXES_LATERAL_RIGHT];

// -- colors of landmarks on canvas
const LEFT_COLOR = "rgb(0,217,231)";
const RIGHT_COLOR = "rgb(255,138,0)";

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
 * For lateral, we only want the ears(7, 8), the shoulders (11, 12), and the hips (23, 24)
 * For anterior ...
 * @param results
 */
const removeLandmarks = (results: any) => {
  if (results.poseLandmarks) {
    removeElements(
      results.poseLandmarks,
      [0, 1, 2, 3, 4, 5, 6, 9, 10, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 25, 26, 27, 28, 29, 30, 31, 32]
    );
  }
};

const drawOnCanvas = (results: any, canvasCtx: CanvasRenderingContext2D, canvasElement: any, activeEffect: string) => {
  removeLandmarks(results);

  // Draw the overlays.
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  if (results.segmentationMask) {
    canvasCtx.drawImage(results.segmentationMask, 0, 0, canvasElement.width, canvasElement.height);

    // Only overwrite existing pixels.
    if (activeEffect === "mask" || activeEffect === "both") {
      canvasCtx.globalCompositeOperation = "source-in";
      // This can be a color or a texture or whatever...
      canvasCtx.fillStyle = "#00FF007F";
      canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
    } else {
      canvasCtx.globalCompositeOperation = "source-out";
      canvasCtx.fillStyle = "#0000FF7F";
      canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
    }
    // Only overwrite missing pixels.
    canvasCtx.globalCompositeOperation = "destination-atop";
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.globalCompositeOperation = "source-over";
  } else {
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
  }

  // Pose...
  drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
    color: "white",
  });
  drawLandmarks(
    canvasCtx,
    Object.values(POSE_INDEXES_LATERAL_RIGHT).map((index) => results.poseLandmarks[index]),
    { visibilityMin: 0.65, color: "white", fillColor: RIGHT_COLOR }
  );
  drawLandmarks(
    canvasCtx,
    Object.values(POSE_INDEXES_LATERAL_LEFT).map((index) => results.poseLandmarks[index]),
    { visibilityMin: 0.65, color: "white", fillColor: LEFT_COLOR }
  );

  canvasCtx.restore();
};

export { removeLandmarks, drawOnCanvas };
