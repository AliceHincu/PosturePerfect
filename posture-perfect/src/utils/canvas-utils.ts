import { drawConnectors, drawLandmarks, lerp } from "@mediapipe/drawing_utils";
import {
  FACEMESH_FACE_OVAL,
  FACEMESH_LEFT_EYE,
  FACEMESH_LEFT_EYEBROW,
  FACEMESH_LIPS,
  FACEMESH_RIGHT_EYE,
  FACEMESH_RIGHT_EYEBROW,
  FACEMESH_TESSELATION,
  HAND_CONNECTIONS,
  POSE_CONNECTIONS,
  POSE_LANDMARKS,
  POSE_LANDMARKS_LEFT,
  POSE_LANDMARKS_RIGHT,
} from "@mediapipe/holistic";

function removeElements(landmarks: any, elements: any) {
  for (const element of elements) {
    delete landmarks[element];
  }
}

/**
 * Remove landmarks we don't want to draw.
 * @param results
 */
function removeLandmarks(results: any) {
  if (results.poseLandmarks) {
    removeElements(results.poseLandmarks, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 17, 18, 19, 20, 21, 22]);
  }
}

/**
 *
 * @param ctx
 * @param connectors
 */
function connect(ctx: any, connectors: any) {
  const canvas = ctx.canvas;
  for (const connector of connectors) {
    const from = connector[0];
    const to = connector[1];
    if (from && to) {
      if (from.visibility && to.visibility && (from.visibility < 0.1 || to.visibility < 0.1)) {
        continue;
      }
      ctx.beginPath();
      ctx.moveTo(from.x * canvas.width, from.y * canvas.height);
      ctx.lineTo(to.x * canvas.width, to.y * canvas.height);
      ctx.stroke();
    }
  }
}

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

  // Connect elbows to hands. Do this first so that the other graphics will draw on top of these marks.
  canvasCtx.lineWidth = 5;
  if (results.poseLandmarks) {
    if (results.rightHandLandmarks) {
      canvasCtx.strokeStyle = "white";
      connect(canvasCtx, [[results.poseLandmarks[POSE_LANDMARKS.RIGHT_ELBOW], results.rightHandLandmarks[0]]]);
    }
    if (results.leftHandLandmarks) {
      canvasCtx.strokeStyle = "white";
      connect(canvasCtx, [[results.poseLandmarks[POSE_LANDMARKS.LEFT_ELBOW], results.leftHandLandmarks[0]]]);
    }
  }
  // Pose...
  drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
    color: "white",
  });
  drawLandmarks(
    canvasCtx,
    Object.values(POSE_LANDMARKS_LEFT).map((index) => results.poseLandmarks[index]),
    { visibilityMin: 0.65, color: "white", fillColor: "rgb(255,138,0)" }
  );
  drawLandmarks(
    canvasCtx,
    Object.values(POSE_LANDMARKS_RIGHT).map((index) => results.poseLandmarks[index]),
    { visibilityMin: 0.65, color: "white", fillColor: "rgb(0,217,231)" }
  );
  // Hands...
  drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {
    color: "white",
  });
  drawLandmarks(canvasCtx, results.rightHandLandmarks, {
    color: "white",
    fillColor: "rgb(0,217,231)",
    lineWidth: 2,
    radius: (data: any) => {
      return lerp(data.from.z, -0.15, 0.1, 10, 1);
    },
  });
  drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
    color: "white",
  });
  drawLandmarks(canvasCtx, results.leftHandLandmarks, {
    color: "white",
    fillColor: "rgb(255,138,0)",
    lineWidth: 2,
    radius: (data: any) => {
      return lerp(data.from.z, -0.15, 0.1, 10, 1);
    },
  });
  // Face...
  drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
    color: "#C0C0C070",
    lineWidth: 1,
  });
  drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYE, {
    color: "rgb(0,217,231)",
  });
  drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYEBROW, {
    color: "rgb(0,217,231)",
  });
  drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYE, {
    color: "rgb(255,138,0)",
  });
  drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYEBROW, {
    color: "rgb(255,138,0)",
  });
  drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_FACE_OVAL, {
    color: "#E0E0E0",
    lineWidth: 5,
  });
  drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LIPS, {
    color: "#E0E0E0",
    lineWidth: 5,
  });
  canvasCtx.restore();
};

export { removeLandmarks, connect, drawOnCanvas };
