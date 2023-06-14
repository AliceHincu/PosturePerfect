import { Dispatch, SetStateAction } from "react";
import { PostureView } from "../../../utils/posture-utils";

interface DropdownPosteriorViewProps {
  postureView: PostureView;
  setPostureView: Dispatch<SetStateAction<PostureView>>;
}

export const DropdownPosteriorView = ({ postureView, setPostureView }: DropdownPosteriorViewProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPostureView(event.target.value as PostureView);
  };

  return (
    <select value={postureView} onChange={handleChange}>
      <option value={PostureView.LATERAL}>Lateral</option>
      <option value={PostureView.ANTERIOR}>Anterior</option>
    </select>
  );
};
