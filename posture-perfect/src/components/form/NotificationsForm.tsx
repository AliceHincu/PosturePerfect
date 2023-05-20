import { Formik, Form } from "formik";
import { AlertLabel, BreakTimeLabel, WaterLabel } from "./labels/Labels";
import { MINUTE_TO_SECONDS, SECOND, TimeField } from "./dropdowns/TimeField";
import { createTimeFieldValidationSchema } from "./dropdowns/TimeField";
import "./NotificationsForm.css";

export const NotificationsForm = () => {
  return (
    <Formik
      initialValues={{
        timeValueAlert: 15,
        timeUnitAlert: SECOND,
        timeValueBreak: 30,
        timeUnitBreak: MINUTE_TO_SECONDS,
        timeValueWater: 30,
        timeUnitWater: MINUTE_TO_SECONDS,
      }}
      validationSchema={createTimeFieldValidationSchema("timeValueAlert", "timeUnitAlert")
        .concat(createTimeFieldValidationSchema("timeValueBreak", "timeUnitBreak"))
        .concat(createTimeFieldValidationSchema("timeValueWater", "timeUnitWater"))}
      onSubmit={
        //     async (values) => {
        //     console.log("here");
        //     await new Promise((r) => setTimeout(r, 500));
        //     alert(JSON.stringify(values, null, 2));
        //   }
        (values) => console.log(values)
      }
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
