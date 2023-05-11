import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { PostureView } from "../../utils/posture-utils";
import { Dispatch, SetStateAction } from "react";

interface DropdownPosteriorViewProps {
  postureView: PostureView;
  setPostureView: Dispatch<SetStateAction<PostureView>>;
}

export const DropdownPosteriorView = ({ postureView, setPostureView }: DropdownPosteriorViewProps) => {
  const handleChange = (event: SelectChangeEvent) => {
    setPostureView(event.target.value as PostureView);
  };

  return (
    <FormControl fullWidth>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={postureView}
        label="PostureView"
        onChange={handleChange}
        style={{ backgroundColor: "white" }}
      >
        <MenuItem value={PostureView.LATERAL}>Lateral</MenuItem>
        <MenuItem value={PostureView.ANTERIOR}>Anterior</MenuItem>
      </Select>
    </FormControl>
  );
};
