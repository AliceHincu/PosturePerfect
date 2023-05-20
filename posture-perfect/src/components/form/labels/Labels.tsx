import { Label } from "./Label";
import { TbAlertTriangleFilled } from "react-icons/tb";
import { GiWaterDrop, GiMuscleUp } from "react-icons/gi";

export const AlertLabel = () => {
  return (
    <Label
      icon={<TbAlertTriangleFilled color="#d32f50" />}
      text="Alert Notification"
      tooltipId="Alert"
      tooltipText="Hello world! I'm a Tooltip"
    ></Label>
  );
};

export const WaterLabel = () => {
  return (
    <Label
      icon={<GiWaterDrop color="#0075ff" />}
      text="Water Notification"
      tooltipId="Water"
      tooltipText="Hello world! I'm a Tooltip"
    ></Label>
  );
};

export const BreakTimeLabel = () => {
  return (
    <Label
      icon={<GiMuscleUp color="#309f93" />}
      text="Break-time Notification"
      tooltipId="Break"
      tooltipText="Hello world! I'm a Tooltip"
    ></Label>
  );
};
