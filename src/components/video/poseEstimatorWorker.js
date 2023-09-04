import { Pose } from "@mediapipe/pose";

self.addEventListener("message", async (e) => {
  const str = e.data;
  //   console.log(modelConfig, poseConfig, frameData);

  //   if (frameData && poseConfig) {
  //     // Initialize your Pose model and set options
  //     let poseRef = new Pose(modelConfig); // Assume Pose is available in the worker context
  //     poseRef.setOptions(poseConfig);

  //     // Perform the actual pose estimation
  //     const results = await poseRef.send(frameData); // Assume estimate() is the method to get pose

  //     // Once done, send back the result to the main thread
  self.postMessage({ str });
  //   }
});
