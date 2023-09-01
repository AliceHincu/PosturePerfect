// onmessage = (e) => {
//   const { multiply } = e.data;
//   // check data is correctly framed
//   if (multiply && multiply.array.length) {
//     // intentionally delay the execution
//     setTimeout(() => {
//       // this post back the result to the page
//       postMessage({
//         result: multiply.array.reduce((firstItem, secondItem) => firstItem * secondItem),
//       });
//     }, 2000);
//   } else {
//     postMessage({ result: 0 });
//   }
// };

// import { Pose } from "@mediapipe/pose";
importScripts("@mediapipe/pose/pose.js"); // Adjust the path as needed

self.addEventListener("message", async (event) => {
  const { poseConfig, frameData } = event.data;

  const canvas = new OffscreenCanvas(640, 480); // or whatever dimensions you need
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.src = frameData;
  img.onload = async () => {
    ctx.drawImage(img, 0, 0);

    const modelConfig = {
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose@latest/${file}`,
    };

    const pose = new Pose(modelConfig);
    pose.setOptions(poseConfig);
    const results = await pose.send({ image: canvas });
    self.postMessage({ results });
  };
});
