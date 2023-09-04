import { Rectangle } from "@mediapipe/control_utils";

const canvasDimensions = (size: Rectangle) => {
  const aspect = size.height / size.width;
  let width, height;
  if (window.innerWidth > window.innerHeight) {
    height = window.innerHeight;
    width = height / aspect;
  } else {
    width = window.innerWidth;
    height = width * aspect;
  }
  return { width, height };
};

export { canvasDimensions };
