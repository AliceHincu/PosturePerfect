import { DropdownPosteriorView } from "./dropdowns/DropdownPosteriorView";
import { PostureView } from "../../utils/posture-utils";
import { Dispatch, SetStateAction } from "react";
import { Modal } from "../modal/Modal";

interface PostureViewFormProps {
  postureView: PostureView;
  setPostureView: Dispatch<SetStateAction<PostureView>>;
  calibratePosture: any;
  startCorrection: boolean;
  startPostureCorrection: () => void;
  stopPostureCorrection: () => void;
  disableStart: boolean;
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
}: PostureViewFormProps) => {
  const handleClick = () => {
    if (startCorrection) {
      stopPostureCorrection();
    } else {
      startPostureCorrection();
    }
  };

  return (
    <div className="form-content">
      <div className="card-title-top">Posture View</div>
      <DropdownPosteriorView postureView={postureView} setPostureView={setPostureView}></DropdownPosteriorView>
      {postureView === PostureView.ANTERIOR && (
        <button onClick={calibratePosture} disabled={startCorrection}>
          Calibrate Posture
        </button>
      )}
      <button onClick={handleClick} disabled={disableStart}>
        {startCorrection ? "Stop posture correction" : "Start posture correction"}
      </button>
      <Modal></Modal>
    </div>
  );
};
