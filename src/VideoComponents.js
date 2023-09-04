import React, { useEffect, useRef } from "react";

const VideoComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    });

    const interval = setInterval(() => {
      if (videoRef.current.playing) {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const data = canvas.toDataURL("image/jpeg");
        client.send(data);
      }
    }, 1000 / 30); // Send 30 frames per second

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} style={{ width: 640, height: 480 }} />
    </div>
  );
};

export default VideoComponent;
