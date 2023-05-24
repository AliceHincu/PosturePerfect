import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { PostureView } from "../../../utils/posture-utils";

// Define a type for the slice state
interface PostureState {
  poseLandmarks: any;
  postureView: PostureView;
}

// Define the initial state using that type
const initialState: PostureState = {
  poseLandmarks: null,
  postureView: PostureView.ANTERIOR,
};

export const postureSlice = createSlice({
  name: "posture",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setPoseLandmarks: (state, action: PayloadAction<any>) => {
      state.poseLandmarks = action.payload;
    },
    setPostureView: (state, action: PayloadAction<PostureView>) => {
      state.postureView = action.payload;
    },
  },
});

// export const { increment, decrement, incrementByAmount } = postureSlice.actions;
export const { setPoseLandmarks, setPostureView } = postureSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectPoseLandmarks = (state: RootState) => state.posture.poseLandmarks;
export const selectPostureView = (state: RootState) => state.posture.postureView;

export default postureSlice.reducer;
