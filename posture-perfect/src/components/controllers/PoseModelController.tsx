import { Dispatch, SetStateAction, useState } from "react";
import { initialConfig } from "../../utils/model-utils";
import "./controllers.css";
import { Typography } from "@mui/material";
import { Toggle } from "../ui/Toggle";
import { ContinousSlider } from "../ui/ContinousSlider";
import DiscreteSlider from "../ui/DiscreteSlider";
import { MODEL_COMPLEXITY } from "../../utils/posture-utils";
import { FpsController } from "./FpsController";
import CameraSelect from "../video/CameraSelect";
import { Device } from "../../hooks/useCamera";

interface PoseModelControllerProps {
  onConfigChange: (config: any) => void;
  increaseFrameCountRef: React.MutableRefObject<(() => void) | null>;
  isEstimationStarted: boolean;
  devices: Device[];
  setDeviceId: Dispatch<SetStateAction<string>>;
}

export const PoseModelController = ({
  onConfigChange,
  increaseFrameCountRef,
  isEstimationStarted,
  devices,
  setDeviceId,
}: PoseModelControllerProps) => {
  const [config, setConfig] = useState(initialConfig);

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setConfig((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSliderChange = (name: string, value: number) => {
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const applyChanges = () => {
    onConfigChange(config);
  };

  return (
    <div className="card-left">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Typography fontSize="1.5rem">Pose Model Config</Typography>
      </div>

      <FpsController increaseFrameCountRef={increaseFrameCountRef} />

      <CameraSelect devices={devices} onChange={setDeviceId} />

      <Toggle
        name="selfieMode"
        label="Selfie Mode"
        checked={config.selfieMode as boolean}
        onChange={handleToggleChange}
      ></Toggle>

      <DiscreteSlider
        values={MODEL_COMPLEXITY}
        defaultValue={MODEL_COMPLEXITY[config.modelComplexity as number]}
        onValueChange={(value: string) => {
          const index = MODEL_COMPLEXITY.indexOf(value);
          handleSliderChange("modelComplexity", index);
        }}
        disabled={false}
      />

      <Toggle
        name="smoothLandmarks"
        label="Smooth Landmarks"
        checked={config.enableSegmentation as boolean}
        onChange={handleToggleChange}
      ></Toggle>
      {/* <Toggle
        name="enableSegmentation"
        label="Enable Segmentation"
        checked={config.enableSegmentation as boolean}
        onChange={handleToggleChange}
      ></Toggle>
      <Toggle
        name="smoothSegmentation"
        label="Smooth Segmentation"
        checked={config.smoothSegmentation as boolean}
        onChange={handleToggleChange}
      ></Toggle> */}

      <ContinousSlider
        label="Min Detection Confidence"
        step={0.01}
        min={0}
        max={1}
        defaultValue={config.minDetectionConfidence as number}
        onValueChange={(value: number) => handleSliderChange("minDetectionConfidence", value)}
        disabled={false}
      ></ContinousSlider>
      <ContinousSlider
        label="Min Tracking Confidence"
        step={0.01}
        min={0}
        max={1}
        defaultValue={config.minTrackingConfidence as number}
        onValueChange={(value: number) => handleSliderChange("minDetectionConfidence", value)}
        disabled={false}
      ></ContinousSlider>

      <button onClick={applyChanges} className="button-posture-analysis" disabled={isEstimationStarted}>
        Change configuration
      </button>
    </div>
  );
};
