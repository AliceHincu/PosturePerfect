import { NotificationLabel, PostureViewLabel } from "./Label";
import { TbAlertTriangleFilled } from "react-icons/tb";
import { GiWaterDrop, GiMuscleUp } from "react-icons/gi";

export const AlertLabel = () => {
  return (
    <NotificationLabel
      icon={<TbAlertTriangleFilled color="#d32f50" />}
      text="Alert Notification"
      tooltipId="Alert"
      tooltipText="If your posture remains improper for a certain duration, you can set the interval between each notification"
    ></NotificationLabel>
  );
};

export const WaterLabel = () => {
  return (
    <NotificationLabel
      icon={<GiWaterDrop color="#0075ff" />}
      text="Water Notification"
      tooltipId="Water"
      tooltipText="While hydration needs can vary based on individual factors, a general guideline for desk workers is to have a sip of water about every 15 to 30 minutes."
    ></NotificationLabel>
  );
};

export const BreakTimeLabel = () => {
  return (
    <NotificationLabel
      icon={<GiMuscleUp color="#309f93" />}
      text="Break-time Notification"
      tooltipId="Break"
      tooltipText="Between possible strategies that can be implemented to mitigate posture problems, a recommendation is the '20-20-20 rule': taking a 20-second break to view something 20 feet away every 20 minutes."
    ></NotificationLabel>
  );
};

export const ThresholdAnteriorAlignmentShouldersLabel = () => {
  return (
    <PostureViewLabel
      text="Shoulder Alignment"
      tooltipId="ShoulderAlignmentAnterior"
      tooltipText="todo..."
    ></PostureViewLabel>
  );
};

export const ThresholdAnteriorAlignmentEyesLabel = () => {
  return (
    <PostureViewLabel text="Eyes Alignment" tooltipId="EyesAlignmentAnterior" tooltipText="todo..."></PostureViewLabel>
  );
};

export const ThresholdLateralOffsetLabel = () => {
  return <PostureViewLabel text="Offset" tooltipId="OffsetLateral" tooltipText="todo..."></PostureViewLabel>;
};

export const ThresholdLateralNeckInclinationLabel = () => {
  return (
    <PostureViewLabel
      text="Neck Inclination"
      tooltipId="NeckInclinationLateral"
      tooltipText="todo..."
    ></PostureViewLabel>
  );
};

export const ThresholdLateralTorsoInclinationLabel = () => {
  return (
    <PostureViewLabel
      text="Torso Inclination"
      tooltipId="TorsoInclinationAnteriorLateral"
      tooltipText="todo..."
    ></PostureViewLabel>
  );
};
