import React, { useEffect, useRef, useState } from "react";
import { drawOnCanvas } from "./canvas-utils";

interface CanvasHandlerProps {
  getPoseResults: () => any;
  videoRef: any;
  isFrozen: boolean;
}

export const CanvasHandler = ({ getPoseResults, videoRef, isFrozen }: CanvasHandlerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const newContext = canvasRef.current.getContext("2d");
    setContext(newContext);
  }, [canvasRef.current]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && videoRef.current) {
        canvasRef.current.width = videoRef.current.width;
        canvasRef.current.height = videoRef.current.height;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [canvasRef, videoRef]);

  useEffect(() => {
    if (!context) return;

    let animationFrameId: number; // Declare this variable to hold the requestAnimationFrame ID

    const drawFrame = () => {
      if (isFrozen) {
        // Clear the canvas if the video is frozen
        if (canvasRef.current) {
          context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      } else {
        const poseResults = getPoseResults();
        if (poseResults && canvasRef.current) {
          drawOnCanvas(poseResults, context, canvasRef);
        }
      }

      animationFrameId = requestAnimationFrame(drawFrame);
    };

    animationFrameId = requestAnimationFrame(drawFrame);

    return () => {
      cancelAnimationFrame(animationFrameId); // Cancel the requestAnimationFrame using the ID
    };
  }, [getPoseResults, context]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 2,
      }}
    >
      <canvas
        style={{
          display: "block",
        }}
        ref={canvasRef}
      />
    </div>
  );
};
