import { Typography } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

interface FpsControllerProps {
  increaseFrameCountRef: React.MutableRefObject<(() => void) | null>;
}

export const FpsController = ({ increaseFrameCountRef }: FpsControllerProps) => {
  const [framesCounter, setFramesCounter] = useState<number>(0);
  const [fpsData, setFpsData] = useState<Array<{ time: number; fps: number }>>([]);
  const framesCounterRef = useRef<number>(0);

  // Synchronize the state with the ref
  useEffect(() => {
    framesCounterRef.current = framesCounter;
  }, [framesCounter]);

  // Function to increase the frame counter
  const incrementFrameCounter = () => {
    setFramesCounter((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    // Assign the function to the ref so parent can call it
    increaseFrameCountRef.current = incrementFrameCounter;
  }, []);

  // Use an effect to log the frame count every second and then reset the counter
  useEffect(() => {
    const logAndResetInterval = setInterval(() => {
      // Update the fpsData state
      setFpsData((prevData) => {
        // (Optional) If you want to limit the length of fpsData, for example, to the last 10 values:
        if (prevData.length >= 10) {
          prevData.shift();
        }

        return [...prevData, { time: Date.now(), fps: framesCounterRef.current }];
      });

      setFramesCounter(0);
    }, 1000);

    return () => {
      clearInterval(logAndResetInterval);
    };
  }, []);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0); // initial width state

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    // Get initial width
    updateWidth();

    // Attach resize event listener
    window.addEventListener("resize", updateWidth);

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: "90%", position: "relative" }}>
      <LineChart width={containerWidth} height={150} data={fpsData}>
        <Line type="monotone" dataKey="fps" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="time" tickFormatter={(time) => new Date(time).toLocaleTimeString()} />
        <YAxis domain={[0, "auto"]} />
        <Tooltip />
      </LineChart>

      <Typography
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none", // ensures it doesn't interfere with chart interactions
          fontSize: "large",
          fontWeight: "bold",
        }}
      >
        {fpsData.length > 0 ? fpsData[fpsData.length - 1].fps : "0"}
        {" fps"}
      </Typography>
    </div>
  );
};
