import { useRef } from "react";
import { Id, toast } from "react-toastify";
import { ToastType, generateToast } from "../components/ui/Toast";

export const useToastManager = () => {
  const cameraAnteriorToast = useRef<Id | null>(null);
  const calibrationToast = useRef<Id | null>(null);
  const postureViewToast = useRef<Id | null>(null);
  const thresholdsToast = useRef<Id | null>(null);

  const updateCameraAnteriorToast = (shouldBeVisible: boolean, message: string, type: ToastType) => {
    if (shouldBeVisible) {
      if (!cameraAnteriorToast.current) {
        cameraAnteriorToast.current = generateToast(message, type);
      }
    } else {
      if (cameraAnteriorToast.current) {
        toast.dismiss(cameraAnteriorToast.current);
        cameraAnteriorToast.current = null;
      }
    }
  };

  const updateCalibrationSettingsToast = (message: string, type: ToastType) => {
    if (calibrationToast.current) {
      toast.dismiss(calibrationToast.current);
    }
    calibrationToast.current = generateToast(message, type);
  };

  const updatePostureViewToast = (message: string, type: ToastType) => {
    if (postureViewToast.current) {
      toast.dismiss(postureViewToast.current);
    }
    postureViewToast.current = generateToast(message, type);
  };

  const updateThresholdsToast = (message: string, type: ToastType) => {
    if (thresholdsToast.current) {
      toast.dismiss(thresholdsToast.current);
    }
    thresholdsToast.current = generateToast(message, type);
  };

  return { updateCameraAnteriorToast, updateCalibrationSettingsToast, updatePostureViewToast, updateThresholdsToast };
};
