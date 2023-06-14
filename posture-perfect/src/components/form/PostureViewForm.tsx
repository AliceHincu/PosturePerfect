import { DropdownPosteriorView } from "./form-fields/DropdownPosteriorView";
import { Thresholds as Thresholds, PostureView } from "../../utils/posture-utils";
import { Dispatch, SetStateAction } from "react";
import { Modal } from "../modal/Modal";
import "./form.css";
import { PostureViewTitleLabel } from "./labels/Label";
import { PostureViewMiniForm } from "./PostureViewMiniForm";

interface PostureViewFormProps {
  postureView: PostureView;
  setPostureView: Dispatch<SetStateAction<PostureView>>;
  calibratePosture: any;
  startCorrection: boolean;
  startPostureCorrection: () => void;
  stopPostureCorrection: () => void;
  disableStart: boolean;
  thresholds: Thresholds;
  setThresholds: Dispatch<SetStateAction<Thresholds>>;
}

/**
 * Form to set the posture view.
 * @param param0
 * @returns
 */
export const PostureViewForm = ({
  postureView,
  setPostureView,
  calibratePosture,
  startCorrection,
  startPostureCorrection,
  stopPostureCorrection,
  disableStart,
  thresholds,
  setThresholds,
}: PostureViewFormProps) => {
  const handleClick = () => {
    if (startCorrection) {
      stopPostureCorrection();
    } else {
      startPostureCorrection();
    }
  };

  return (
    <div className="form-content space-between">
      <PostureViewTitleLabel></PostureViewTitleLabel>
      <div className="mini-form-content">
        <DropdownPosteriorView postureView={postureView} setPostureView={setPostureView}></DropdownPosteriorView>
        <PostureViewMiniForm
          postureView={postureView}
          thresholds={thresholds}
          setThresholds={setThresholds}
          startCorrection={startCorrection}
        ></PostureViewMiniForm>
        {postureView === PostureView.ANTERIOR && (
          <button onClick={calibratePosture} disabled={startCorrection} className="posture-view-button">
            Calibrate Posture
          </button>
        )}
      </div>

      <div className="posture-view-last-row">
        <button onClick={handleClick} disabled={disableStart} className="posture-view-button">
          {startCorrection ? "Stop posture correction" : "Start posture correction"}
        </button>
        <Modal></Modal>
      </div>
    </div>
  );
};
