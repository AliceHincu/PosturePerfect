import { Form, Formik } from "formik";
import { Thresholds, PostureView } from "../../utils/posture-utils";
import { ThresholdField, createThresholdFieldValidationSchema } from "./form-fields/ThresholdField";
import {
  ThresholdAnteriorAlignmentShouldersLabel,
  ThresholdAnteriorAlignmentEyesLabel,
  ThresholdLateralOffsetLabel,
  ThresholdLateralNeckInclinationLabel,
  ThresholdLateralTorsoInclinationLabel,
} from "./labels/Labels";
import { Dispatch, SetStateAction } from "react";

interface PostureViewMiniFormProps {
  postureView: PostureView;
  thresholds: Thresholds;
  setThresholds: Dispatch<SetStateAction<Thresholds>>;
  startCorrection: boolean;
}

export const PostureViewMiniForm = ({
  postureView,
  thresholds,
  setThresholds,
  startCorrection,
}: PostureViewMiniFormProps) => {
  return (
    <Formik
      initialValues={thresholds}
      validationSchema={createThresholdFieldValidationSchema()}
      onSubmit={(values) => setThresholds(values)}
    >
      <Form style={{ gap: "0.25rem" }}>
        {postureView === PostureView.ANTERIOR && (
          <>
            <div className="form-row">
              <ThresholdAnteriorAlignmentShouldersLabel></ThresholdAnteriorAlignmentShouldersLabel>
              <ThresholdField name="ALIGNMENT_SHOULDERS_THRESHOLD_ANTERIOR"></ThresholdField>
            </div>
            <div className="form-row">
              <ThresholdAnteriorAlignmentEyesLabel></ThresholdAnteriorAlignmentEyesLabel>
              <ThresholdField name="ALIGNMENT_EYES_THRESHOLD_ANTERIOR"></ThresholdField>
            </div>
          </>
        )}

        {postureView === PostureView.LATERAL && (
          <>
            <div className="form-row">
              <ThresholdLateralOffsetLabel></ThresholdLateralOffsetLabel>
              <ThresholdField name="OFFSET_THRESHOLD"></ThresholdField>
            </div>
            <div className="form-row">
              <ThresholdLateralNeckInclinationLabel></ThresholdLateralNeckInclinationLabel>
              <ThresholdField name="NECK_INCLINATION_THRESHOLD"></ThresholdField>
            </div>
            <div className="form-row">
              <ThresholdLateralTorsoInclinationLabel></ThresholdLateralTorsoInclinationLabel>
              <ThresholdField name="TORSO_INCLINATION_THRESHOLD"></ThresholdField>
            </div>
          </>
        )}

        <button type="submit" className="posture-view-button" style={{ marginTop: "5px" }} disabled={startCorrection}>
          Submit thresholds
        </button>
      </Form>
    </Formik>
  );
};
