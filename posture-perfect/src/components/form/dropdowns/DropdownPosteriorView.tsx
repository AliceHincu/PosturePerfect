import { setPostureView } from "../../../redux/features/posture/postureSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { PostureView } from "../../../utils/posture-utils";

export const DropdownPosteriorView = () => {
  const postureView = useAppSelector((state) => state.posture.postureView);
  const dispatch = useAppDispatch();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setPostureView(event.target.value as PostureView));
  };

  return (
    <select value={postureView} onChange={handleChange}>
      <option value={PostureView.LATERAL}>Lateral</option>
      <option value={PostureView.ANTERIOR}>Anterior</option>
    </select>
  );
};
