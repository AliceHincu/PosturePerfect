import { Field, useFormikContext } from "formik";
import "./ThresholdField.css";
import { Thresholds } from "../../../utils/posture-utils";
import * as Yup from "yup";

interface ThresholdFieldProps {
  name: string;
}

export const ThresholdField = ({ name }: ThresholdFieldProps) => {
  const { errors } = useFormikContext<Thresholds>();
  const cssClassName = "threshold-field " + (errors[name as keyof typeof errors] ? "error-outline" : "");

  return <Field name={name} type="number" className={cssClassName} />;
};

/**
 * Validations for time field input.
 * - ALIGNMENT_SHOULDERS_THRESHOLD_ANTERIOR = [0.01, 0.1]
 * - ALIGNMENT_EYES_THRESHOLD_ANTERIOR = [0.01, 0.1]
 * export interface Thresholds {
  OFFSET_THRESHOLD: number;
  NECK_INCLINATION_THRESHOLD: number;
  TORSO_INCLINATION_THRESHOLD: number;
}

 * @param timeValueName
 * @param timeUnitName
 * @returns
 */
export const createThresholdFieldValidationSchema = () => {
  return Yup.object().shape({
    ALIGNMENT_SHOULDERS_THRESHOLD_ANTERIOR: Yup.number().required("Required").min(0.01, "Min 0.01").max(0.1, "Max 0.1"),
    ALIGNMENT_EYES_THRESHOLD_ANTERIOR: Yup.number().required("Required").min(0.01, "Min 0.01").max(0.1, "Max 0.1"),
  });
};
