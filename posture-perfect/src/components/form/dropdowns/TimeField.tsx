import { ErrorMessage, Field, useFormikContext } from "formik";
import * as Yup from "yup";
import "./TimeField.css";
import { NotificationValues } from "../../NotificationManager";

interface TimeFieldProps {
  timeValueName: keyof NotificationValues;
  timeUnitName: keyof NotificationValues;
  checkboxName: keyof NotificationValues;
}

export const SECOND = "1";
export const MINUTE_TO_SECONDS = "60";
export const HOUR_TO_SECONDS = "3600";

/**
 * Component for user to input the interval of time between notifications.
 * - The left field represents the number of time units that the user wants.
 * - The right field represents what time unit is used.
 * - An error message will appear below if the inputs are invalid
 * @param {string} timeValueName - number of units
 * @param {string} timeUnitName - type of unit (second/minute/hour)
 * @param {string} checkboxName - check if you want to receive notifications of certain type or not
 * @returns
 */
export const TimeField = ({ timeValueName, timeUnitName, checkboxName }: TimeFieldProps) => {
  const { errors, values } = useFormikContext<NotificationValues>();
  const cssClassName = "time-field " + (errors[timeValueName as keyof typeof errors] ? "error-outline" : "");

  return (
    <div className="form-col">
      <div className="form-row">
        <Field name={timeValueName} type="number" className={cssClassName} disabled={!values[checkboxName]} />
        <Field as="select" name={timeUnitName} className="time-field pointer" disabled={!values[checkboxName]}>
          <option value={HOUR_TO_SECONDS}>hours</option>
          <option value={MINUTE_TO_SECONDS}>minutes</option>
          <option value={SECOND}>seconds</option>
        </Field>
        <div className="notify-wrapper">
          <Field name={checkboxName} type="checkbox" className="pointer"></Field>
          <span>Notify</span>
        </div>
      </div>
      <ErrorMessage name={timeValueName} component="div" className="error-text" />
    </div>
  );
};

/**
 * Validations for time field input.
 * - seconds = [5, 59]
 * - minuted = [1, 59]
 * - hours = [1, 2]
 * @param timeValueName
 * @param timeUnitName
 * @returns
 */
export const createTimeFieldValidationSchema = (timeValueName: string, timeUnitName: string) => {
  return Yup.object().shape({
    [timeUnitName]: Yup.string().required("Required"),
    [timeValueName]: Yup.number()
      .when(timeUnitName, {
        is: SECOND, // seconds
        then: (schema) => schema.min(15, "Minimum 15 seconds").max(59, "Maximum 59 seconds"),
      })
      .when(timeUnitName, {
        is: MINUTE_TO_SECONDS, // minutes
        then: (schema) => schema.min(1, "Minimum 1 minute").max(59, "Maximum 59 minutes"),
      })
      .when(timeUnitName, {
        is: HOUR_TO_SECONDS, // hours
        then: (schema) => schema.min(1, "Minimum 1 hour").max(2, "Maximum 2 hours"),
      })
      .required("Required"),
  });
};
