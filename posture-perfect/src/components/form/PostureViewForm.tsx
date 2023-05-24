import { DropdownPosteriorView } from "./dropdowns/DropdownPosteriorView";
import { Dispatch, SetStateAction } from "react";
import { PostureView } from "../../utils/posture-utils";

interface PostureViewFormProps {
  postureView: PostureView;
  setPostureView: Dispatch<SetStateAction<PostureView>>;
  calibratePosture: any;
  startPostureCorrection: (event: React.MouseEvent<HTMLButtonElement>) => void;
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
  startPostureCorrection,
}: PostureViewFormProps) => {
  return (
    <div className="form-content">
      <div className="card-title-top">Posture View</div>
      <DropdownPosteriorView postureView={postureView} setPostureView={setPostureView}></DropdownPosteriorView>
      {postureView === PostureView.ANTERIOR && <button onClick={calibratePosture}>Calibrate Posture</button>}
      <button onClick={startPostureCorrection}>Start posture correction</button>
    </div>
  );
};
