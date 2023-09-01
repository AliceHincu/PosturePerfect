import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { POSE_CONNECTIONS, POSE_LANDMARKS, POSE_LANDMARKS_LEFT, POSE_LANDMARKS_RIGHT } from "@mediapipe/pose";

// -- landmark indexes
const POSE_INDEXES_LATERAL = [
  POSE_LANDMARKS.LEFT_EAR,
  POSE_LANDMARKS.LEFT_SHOULDER,
  POSE_LANDMARKS.LEFT_HIP,
  POSE_LANDMARKS.RIGHT_EAR,
  POSE_LANDMARKS.RIGHT_SHOULDER,
  POSE_LANDMARKS.RIGHT_HIP,
];
const POSE_INDEXES_ANTERIOR = [
  POSE_LANDMARKS.LEFT_EYE,
  POSE_LANDMARKS.LEFT_SHOULDER,
  POSE_LANDMARKS.LEFT_ELBOW,
  POSE_LANDMARKS.RIGHT_EYE,
  POSE_LANDMARKS.RIGHT_SHOULDER,
  POSE_LANDMARKS.RIGHT_ELBOW,
];

const POSE_INDEXES = [...POSE_INDEXES_ANTERIOR, ...POSE_INDEXES_LATERAL, POSE_LANDMARKS.NOSE];

export const drawOnCanvas = (poseResults: any, context: CanvasRenderingContext2D, canvasRef: any) => {
  if (!context || !canvasRef.current) return;

  context.save();
  context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

  drawConnectors(context, poseResults, POSE_CONNECTIONS, {
    color: "white",
  });
  drawLandmarks(
    context,
    Object.values(POSE_INDEXES).map((key) => poseResults[key]),
    { visibilityMin: 0.65, color: "white", fillColor: "rgb(0,217,231)" }
  );
  context.restore();
};
