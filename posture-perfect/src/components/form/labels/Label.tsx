import { Tooltip } from "react-tooltip";
import { AiOutlineInfoCircle } from "react-icons/ai";
import "./Label.css";

interface NotificationLabelProps {
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
export const NotificationLabel = ({ icon, text, tooltipId, tooltipText }: NotificationLabelProps) => {
  return (
    <>
      <label id="notification-label" className="label">
        <div
          data-tooltip-id={tooltipId}
          data-tooltip-content={tooltipText}
          data-tooltip-place="top"
          className="notification-content"
        >
          {icon ? icon : ""}
          <div id="notification-text">{text}</div>
          <AiOutlineInfoCircle color="white" />
        </div>
      </label>
      <Tooltip id={tooltipId} style={{ width: "300px" }} />
    </>
  );
};

interface PostureViewProps {
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
export const PostureViewLabel = ({ text, tooltipId, tooltipText }: PostureViewProps) => {
  return (
    <>
      <label id="postureview-label" className="label-form">
        <div
          data-tooltip-id={tooltipId}
          data-tooltip-content={tooltipText}
          data-tooltip-place="left"
          className="posture-view-content"
        >
          <AiOutlineInfoCircle color="white" size={13} />
          <div id="notification-text" style={{ whiteSpace: "nowrap" }}>
            {text}
          </div>
        </div>
      </label>
      <Tooltip id={tooltipId} style={{ width: "200px" }} />
    </>
  );
};

const notificationTitleText =
  "You have the ability to establish alerts at intervals ranging from X to X <time_unit> to remind you to correct your posture, drink water or take a break.";
export const NotificationTitleLabel = () => {
  return (
    <>
      <div className="label-with-icon">
        <div
          data-tooltip-id="notifications-title"
          data-tooltip-content={notificationTitleText}
          data-tooltip-place="top"
          className="card-title-top"
        >
          Notifications {"\u00A0"}
          {"\u00A0"} <AiOutlineInfoCircle color="white" />
        </div>
      </div>
      <Tooltip id="notifications-title" style={{ width: "300px" }} />
    </>
  );
};

const postureViewTitleText = "todo....";
export const PostureViewTitleLabel = () => {
  return (
    <>
      <div className="label-with-icon">
        <div
          data-tooltip-id="notifications-title"
          data-tooltip-content={postureViewTitleText}
          data-tooltip-place="left"
          className="card-title-top"
        >
          {/* <div className="card-title-top">Posture View</div> */}
          Posture View {"\u00A0"}
          {"\u00A0"} <AiOutlineInfoCircle color="white" />
        </div>
      </div>
      <Tooltip id="notifications-title" style={{ width: "300px" }} />
    </>
  );
};
