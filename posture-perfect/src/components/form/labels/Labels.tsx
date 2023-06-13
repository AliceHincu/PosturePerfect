import { Label } from "./Label";
import { TbAlertTriangleFilled } from "react-icons/tb";
import { GiWaterDrop, GiMuscleUp } from "react-icons/gi";

export const AlertLabel = () => {
  return (
    <Label
      icon={<TbAlertTriangleFilled color="#d32f50" />}
      text="Alert Notification"
      tooltipId="Alert"
      tooltipText="If your posture remains improper for a certain duration, you can set the interval between each notification"
    ></Label>
  );
};

export const WaterLabel = () => {
  return (
    <Label
      icon={<GiWaterDrop color="#0075ff" />}
      text="Water Notification"
      tooltipId="Water"
      tooltipText="While hydration needs can vary based on individual factors, a general guideline for desk workers is to have a sip of water about every 15 to 30 minutes."
    ></Label>
  );
};

export const BreakTimeLabel = () => {
  return (
    <Label
      icon={<GiMuscleUp color="#309f93" />}
      text="Break-time Notification"
      tooltipId="Break"
      tooltipText="Between possible strategies that can be implemented to mitigate posture problems, a recommendation is the '20-20-20 rule': taking a 20-second break to view something 20 feet away every 20 minutes."
    ></Label>
  );
};
