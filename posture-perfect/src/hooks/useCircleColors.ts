import { useEffect, useRef } from "react";
import { ErrorDetails } from "../components/PostureProcessing";

export const useCircleColors = (isEstimationStarted: boolean) => {
  const circleRefs = useRef<{
    elbowsCircle: HTMLDivElement | null;
    userCloseCircle: HTMLDivElement | null;
    userLeaningCircle: HTMLDivElement | null;
    shouldersCircle: HTMLDivElement | null;
    headCircle: HTMLDivElement | null;
  }>({
    elbowsCircle: null,
    userCloseCircle: null,
    userLeaningCircle: null,
    shouldersCircle: null,
    headCircle: null,
  });

  const errorToRefMapping: { [key: string]: keyof typeof circleRefs.current } = {
    elbowsTooFar: "elbowsCircle",
    userTooClose: "userCloseCircle",
    userLeaning: "userLeaningCircle",
    shouldersHunched: "shouldersCircle",
    headHunched: "headCircle",
  };

  const updateCircleColors = (errorDetails: ErrorDetails) => {
    Object.keys(errorToRefMapping).forEach((key) => {
      const condition = errorDetails[key as keyof ErrorDetails];
      const circle = circleRefs.current[errorToRefMapping[key]];

      if (circle) {
        circle.style.backgroundColor = condition ? "red" : condition === false ? "green" : "grey";
      }
    });
  };

  const resetCircleColors = () => {
    Object.values(circleRefs.current).forEach((circle) => {
      if (circle) {
        circle.style.backgroundColor = "grey";
      }
    });
  };

  useEffect(() => {
    if (!isEstimationStarted) {
      const timerId = setTimeout(() => {
        resetCircleColors();
      }, 500); // 500ms delay

      // Clear the timer if the component is unmounted
      return () => {
        clearTimeout(timerId);
      };
    }
  }, [isEstimationStarted]);

  return { circleRefs, updateCircleColors }; // you can return this ref if needed in your component
};
