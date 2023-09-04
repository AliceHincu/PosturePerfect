import React, { Dispatch, SetStateAction, useEffect } from "react";
import CameraSelect from "./CameraSelect";
import useCamera from "../../hooks/useCamera";
import { VideoPlayer } from "./VideoPlayer";
import { OptionMap } from "@mediapipe/control_utils";
import { PostureView } from "../../utils/posture-utils";
import { usePoseEstimation } from "./PoseEstimator";

interface VideoHandlerProps {
  deviceId: string;
  onUserMedia: () => void;
  videoRef: any;
  poseConfig: OptionMap;
  isFrozen: boolean;
  setVideoLoading: Dispatch<SetStateAction<boolean>>;
}

export const VideoHandler = ({
  deviceId,
  onUserMedia,
  videoRef,
  poseConfig,
  isFrozen,
  setVideoLoading,
}: VideoHandlerProps) => {
  return (
    <>
      <VideoPlayer
        deviceId={deviceId}
        onUserMedia={onUserMedia}
        videoRef={videoRef}
        poseConfig={poseConfig}
        isFrozen={isFrozen}
        setVideoLoading={setVideoLoading}
      />
    </>
  );
};
