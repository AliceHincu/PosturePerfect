import { Tooltip } from "react-tooltip";
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
        <div id={tooltipId} className="notification-content">
          {icon}
          <div id="notification-text">{text}</div>
        </div>
      </label>
      <Tooltip data-tooltip-id={tooltipId} place="top" data-tooltip-variant="info" content={tooltipText} />
    </>
  );
};
