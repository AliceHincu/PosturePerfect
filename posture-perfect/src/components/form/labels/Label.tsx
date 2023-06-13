import { Tooltip } from "react-tooltip";
import { AiOutlineInfoCircle } from "react-icons/ai";
import "./Label.css";

interface LabelProps {
  icon: any;
  text: string;
  tooltipText: string;
  tooltipId: string;
}

/**
 * The label of the fields which specifies to the user what the fields represent.
 * It is made up of an icon, a text, and a tooltip that shows when the user hovers over the first two mentioned.
 * The tooltip gives the user more details about the fields.
 * @param param0
 * @returns
 */
export const Label = ({ icon, text, tooltipId, tooltipText }: LabelProps) => {
  return (
    <>
      <label id="notification-label" className="label-with-icon">
        <div
          data-tooltip-id={tooltipId}
          data-tooltip-content={tooltipText}
          data-tooltip-place="top"
          className="notification-content"
        >
          {icon}
          <div id="notification-text">{text}</div>
          <AiOutlineInfoCircle color="white" />
        </div>
      </label>
      <Tooltip id={tooltipId} style={{ width: "300px" }} />
    </>
  );
};

const titleText =
  "You have the ability to establish alerts at intervals ranging from X to X <time_unit> to remind you to correct your posture, drink water or take a break.";
export const TitleNotifications = () => {
  return (
    <>
      <div className="label-with-icon">
        <h2
          data-tooltip-id="notifications-title"
          data-tooltip-content={titleText}
          data-tooltip-place="top"
          className="card-title"
        >
          Notifications {"\u00A0"}
          {"\u00A0"} <AiOutlineInfoCircle color="white" />
        </h2>
      </div>
      <Tooltip id="notifications-title" style={{ width: "300px" }} />
    </>
  );
};
