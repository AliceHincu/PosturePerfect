import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pose } from "@mediapipe/pose";
import { initialConfig, modelConfig } from "../../utils/model-utils";
import { OptionMap } from "@mediapipe/control_utils";

// This hook is responsible for getting the pose estimation
export const usePoseEstimation = ({
  videoRef,
  onFrameResult,
}: {
  videoRef: React.RefObject<HTMLVideoElement>;
  onFrameResult: (results: any) => void;
}) => {
  const poseRef = useRef<Pose | null>(null);
  const [poseConfig, setPoseConfig] = useState<OptionMap>(initialConfig);
  const [modelLoading, setModelLoading] = useState(true); // Assume video is loading initially
  let id: any;

  const processFrame = async () => {
    if (!videoRef.current) return;

    const { current: video } = videoRef;
    // Skip processing if dimensions are invalid
    if (video.videoWidth <= 0 || video.videoHeight <= 0) {
      return;
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (poseRef.current) {
      await poseRef.current.send({ image: canvas });
    }
    // requestAnimationFrame(processFrame);
  };

  useEffect(() => {
    setModelLoading(true);
    if (poseRef.current) poseRef.current.setOptions(poseConfig);
  }, [poseConfig]);

  const initializeModel = useCallback(
    (config: any) => {
      if (!videoRef.current) return;

      cancelAnimationFrame(id); // Cancel the previous animation frame
      setModelLoading(true);
      poseRef.current = new Pose(modelConfig);
      poseRef.current.setOptions(config);
      poseRef.current.onResults((results: any) => {
        onFrameResult(results);
        if (modelLoading) setModelLoading(false); // Set video as ready
        id = requestAnimationFrame(processFrame);
      });

      setPoseConfig(config);

      videoRef.current.onloadedmetadata = async () => {
        if (videoRef.current) {
          if (videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
            videoRef.current.play();
            id = requestAnimationFrame(processFrame);
          }
        }
      };

      return () => {
        cancelAnimationFrame(id);
      };
    },
    [videoRef, onFrameResult]
  );

  return {
    initializeModel,
    modelLoading,
    setPoseConfig,
    poseConfig,
  };
};
