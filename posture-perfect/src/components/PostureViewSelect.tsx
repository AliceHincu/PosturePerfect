import { PostureView } from "../utils/posture-utils";

interface PostureViewSelectProps {
  onPostureViewChange: (postureView: PostureView) => void;
}

const PostureViewSelect = ({ onPostureViewChange }: PostureViewSelectProps) => {
  return (
    <select
      style={{
        position: "absolute",
        top: "5%",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1,
      }}
      onChange={(event) => onPostureViewChange(event.target.value as PostureView)}
      defaultValue={PostureView.ANTERIOR}
    >
      <option value={PostureView.ANTERIOR}>{PostureView.ANTERIOR}</option>
      <option value={PostureView.LATERAL}>{PostureView.LATERAL}</option>
    </select>
  );
};

export default PostureViewSelect;
