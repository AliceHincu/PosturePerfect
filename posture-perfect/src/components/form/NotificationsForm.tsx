import { Formik, Form } from "formik";
import { AlertLabel, BreakTimeLabel, WaterLabel } from "./labels/Labels";
import { TimeField } from "./dropdowns/TimeField";
import { createTimeFieldValidationSchema } from "./dropdowns/TimeField";
import "./NotificationsForm.css";
import { NotificationValues } from "../NotificationManager";

interface NotificationsFormProps {
  initialValues: NotificationValues;
  handleFormSubmit: (values: NotificationValues) => void;
}

/**
 * Form to set notifications' intervals' details.
 * @param param0
 * @returns
 */
export const NotificationsForm = ({ initialValues, handleFormSubmit }: NotificationsFormProps) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={createTimeFieldValidationSchema("timeValueAlert", "timeUnitAlert")
        .concat(createTimeFieldValidationSchema("timeValueBreak", "timeUnitBreak"))
        .concat(createTimeFieldValidationSchema("timeValueWater", "timeUnitWater"))}
      onSubmit={(values) => handleFormSubmit(values)}
    >
      <Form>
        <div className="form-content">
          <h2 className="card-title">Notifications</h2>

          <AlertLabel></AlertLabel>
          <TimeField timeValueName="timeValueAlert" timeUnitName="timeUnitAlert"></TimeField>

          <BreakTimeLabel></BreakTimeLabel>
          <TimeField timeValueName="timeValueBreak" timeUnitName="timeUnitBreak"></TimeField>

          <WaterLabel></WaterLabel>
          <TimeField timeValueName="timeValueWater" timeUnitName="timeUnitWater"></TimeField>
        </div>

        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
};
