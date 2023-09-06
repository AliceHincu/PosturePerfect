import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Spinner } from "../ui/Spinner";
import { OptionMap } from "@mediapipe/control_utils";

interface VideoPlayerProps {
  onUserMedia: () => void;
  deviceId: string;
  videoRef: any;
  poseConfig: OptionMap;
  isFrozen: boolean;
  setVideoLoading: Dispatch<SetStateAction<boolean>>;
}

// This component is responsible for getting the video feed
export const VideoPlayer = ({
  onUserMedia,
  deviceId,
  videoRef,
  poseConfig,
  isFrozen,
  setVideoLoading,
}: VideoPlayerProps) => {
  const mediaStreamRef = useRef<MediaStream | null>(null); // <-- Declare a new useRef
  useEffect(() => {
    const getMedia = async () => {
      setVideoLoading(true);
      const constraints = {
        video: {
          aspectRatio: 4 / 3,
          facingMode: "user",
          width: { min: 256 },
          height: { min: 144 },
          deviceId: deviceId ? { exact: deviceId } : undefined,
        },
      };

      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        mediaStreamRef.current = stream; // <-- Save the MediaStream
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          onUserMedia();
        }
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
      setVideoLoading(false);
    };

    getMedia();

    return () => {
      if (mediaStreamRef.current) {
        // <-- Use the saved MediaStream
        const tracks = mediaStreamRef.current.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [deviceId, onUserMedia]);

  return (
    <>
      <div className="container">
        <Spinner loading={isFrozen}></Spinner>
      </div>
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
          zIndex: 1,
          opacity: isFrozen ? 0 : 1,
        }}
      >
        <video
          width="640"
          height="480"
          style={{
            objectFit: "cover", // Ensures the aspect ratio is maintained
            transform: poseConfig.selfieMode ? "scaleX(-1)" : "",
          }}
          autoPlay
          playsInline
          muted
          ref={videoRef}
        />
      </div>
    </>
  );
};
