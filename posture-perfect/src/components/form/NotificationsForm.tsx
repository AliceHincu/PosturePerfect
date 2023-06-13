import { Formik, Form } from "formik";
import { AlertLabel, BreakTimeLabel, WaterLabel } from "./labels/Labels";
import { TimeField } from "./dropdowns/TimeField";
import { createTimeFieldValidationSchema } from "./dropdowns/TimeField";
import "./NotificationsForm.css";
import { NotificationValues } from "../NotificationManager";
import { TitleNotifications } from "./labels/Label";

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
      validationSchema={createTimeFieldValidationSchema("timeValuePosture", "timeUnitPosture")
        .concat(createTimeFieldValidationSchema("timeValueBreak", "timeUnitBreak"))
        .concat(createTimeFieldValidationSchema("timeValueWater", "timeUnitWater"))}
      onSubmit={(values) => handleFormSubmit(values)}
    >
      <Form>
        <div className="form-content">
          <TitleNotifications></TitleNotifications>

          <AlertLabel></AlertLabel>
          <TimeField
            timeValueName="timeValuePosture"
            timeUnitName="timeUnitPosture"
            checkboxName="checkboxPosture"
          ></TimeField>

          <BreakTimeLabel></BreakTimeLabel>
          <TimeField
            timeValueName="timeValueBreak"
            timeUnitName="timeUnitBreak"
            checkboxName="checkboxBreak"
          ></TimeField>

          <WaterLabel></WaterLabel>
          <TimeField
            timeValueName="timeValueWater"
            timeUnitName="timeUnitWater"
            checkboxName="checkboxWater"
          ></TimeField>
        </div>

        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
};
