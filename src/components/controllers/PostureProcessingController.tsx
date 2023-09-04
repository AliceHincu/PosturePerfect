import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import "./controllers.css";
import { PostureView, THRESHOLD_VALUES_ARRAY, ThresholdStrictness } from "../../utils/posture-utils";
import DiscreteSlider from "../ui/DiscreteSlider";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { Tooltip } from "react-tooltip";

interface PostureProcessingControllerProps {
  isEstimationStarted: boolean;
  setIsEstimationStarted: Dispatch<SetStateAction<boolean>>;
  selectedPostureView: PostureView;
  setSelectedPostureView: (postureView: PostureView) => void;
  setCalibration: () => void;
  setThresholdStrictness: (thresholds: ThresholdStrictness) => void;
  setStarted: () => void;
  setScore: () => void;
  areButtonsDisabled: boolean;
  videoRef: any;
  circleRefs: any;
}

export const PostureProcessingController = ({
  isEstimationStarted,
  setIsEstimationStarted,
  selectedPostureView,
  setSelectedPostureView,
  setCalibration,
  setThresholdStrictness,
  setStarted,
  setScore,
  areButtonsDisabled,
  videoRef,
  circleRefs,
}: PostureProcessingControllerProps) => {
  const [isStartDisabled, setIsStartDisabled] = useState<boolean>(true);
  const [isCalibrationDisabled, setIsCalibrationDisabled] = useState<boolean>(false);

  const isFirstRender = useRef<boolean>(true);

  useEffect(() => {
    if (isFirstRender.current) {
      // Skip the first render
      isFirstRender.current = false;
      return;
    }
    if (!isEstimationStarted) {
      setIsCalibrationDisabled(areButtonsDisabled);
      setIsStartDisabled(areButtonsDisabled);
    }
  }, [areButtonsDisabled]);

  const onClickedStartBtn = (isStarting: boolean) => {
    setIsEstimationStarted(isStarting);
    if (selectedPostureView == PostureView.ANTERIOR) {
      setIsCalibrationDisabled(isStarting);
    }
    if (isStarting) {
      setStarted();
    } else {
      setScore();
    }
  };

  const calibrate = () => {
    setIsStartDisabled(false);
    setCalibration();
  };

  const handleSliderChange = (value: string) => {
    setThresholdStrictness(value as ThresholdStrictness);
  };

  const onPostureViewChanged = (event: any) => {
    const postureView = event.target.value as PostureView;
    setSelectedPostureView(postureView);
    if (postureView == PostureView.ANTERIOR) {
      setIsStartDisabled(true);
      setIsCalibrationDisabled(false);
    } else {
      setIsStartDisabled(false);
    }
  };

  return (
    <div>
      <div className="card-top">
        <h1>Posture View</h1>
        <select onChange={onPostureViewChanged} defaultValue={PostureView.ANTERIOR} className="select-posture-analysis">
          <option value={PostureView.ANTERIOR}>{PostureView.ANTERIOR}</option>
          <option value={PostureView.LATERAL}>{PostureView.LATERAL}</option>
        </select>
        <DiscreteSlider
          values={THRESHOLD_VALUES_ARRAY}
          defaultValue={THRESHOLD_VALUES_ARRAY[1]}
          onValueChange={handleSliderChange}
          disabled={isCalibrationDisabled}
        ></DiscreteSlider>
        {selectedPostureView === PostureView.ANTERIOR && (
          <>
            <div className="label-with-icon">
              <button disabled={isCalibrationDisabled} onClick={calibrate} className="button-posture-analysis">
                {/* Calibrate Anterior Posture */}
                <div
                  data-tooltip-id="calibrate"
                  data-tooltip-content="The application will remember and use this as your correct posture benchmark for future reference."
                  data-tooltip-place="top"
                  className="button-tooltip-text"
                >
                  Calibrate {"\u00A0"}
                  {"\u00A0"} <AiOutlineInfoCircle color="white" />
                </div>
              </button>
            </div>
            <Tooltip id="calibrate" style={{ width: "300px" }} />
          </>
        )}
        <button
          onClick={() => {
            onClickedStartBtn(!isEstimationStarted);
          }}
          disabled={isStartDisabled}
          className="button-posture-analysis"
        >
          {isEstimationStarted ? "Stop posture correction" : "Start posture correction"}
        </button>
      </div>

      <div className="card-under-video" style={{ width: videoRef.current ? videoRef.current.width : "640px" }}>
        {/* Container for Circles and Text */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* Left-side circles */}
          <div className="error-circle-group" id="left-group">
            <div className="error-circle-wrapper">
              <div className="error-circle" ref={(ref) => (circleRefs.current.elbowsCircle = ref)}></div>
              <span>Elbows too far</span>
            </div>
            <div className="error-circle-wrapper">
              <div className="error-circle" ref={(ref) => (circleRefs.current.userCloseCircle = ref)}></div>
              <span>User too close</span>
            </div>
            <div className="error-circle-wrapper">
              <div className="error-circle" ref={(ref) => (circleRefs.current.userLeaningCircle = ref)}></div>
              <span>User leaning</span>
            </div>
          </div>

          {/* Right-side circles */}
          <div className="error-circle-group" id="right-group">
            <div className="error-circle-wrapper">
              <div className="error-circle" ref={(ref) => (circleRefs.current.shouldersCircle = ref)}></div>
              <span>Shoulders hunched</span>
            </div>
            <div className="error-circle-wrapper">
              <div className="error-circle" ref={(ref) => (circleRefs.current.headCircle = ref)}></div>
              <span>Head hunched</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
