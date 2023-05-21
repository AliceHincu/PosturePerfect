import React, { useEffect, useRef } from "react";
import { Id, toast } from "react-toastify";
import { ToastTypes, generateToast, Toast, ToastMessages } from "./ui/Toast";

interface ToastManagerProps {
  isLateralPosCorrect: boolean;
  landmarksVisible: boolean;
}

/**
 * If there are any errors regarding the setup for the analysis of the posture, toasts will show up informing the user about the problem
 * @param isLateralPosCorrect - if the user has a 90 degree of their posture from the camera point of view
 * @param landmarksVisible - if all the necessary landmarks are visible
 * @returns
 */
export const ToastManager: React.FC<ToastManagerProps> = ({ isLateralPosCorrect, landmarksVisible }) => {
  const lateralPosToastId = useRef<Id | null>(null);
  const landmarksVisToastId = useRef<Id | null>(null);

  const removeToast = (toastId: any) => {
    toast.dismiss(toastId);
  };

  const handleToastDisplay = (
    isVisible: boolean,
    toastIdRef: React.MutableRefObject<Id | null>,
    alertMessage: ToastMessages,
    toastType: ToastTypes
  ) => {
    if (!isVisible) {
      toastIdRef.current = generateToast(alertMessage, toastType);
    } else if (toastIdRef.current) {
      removeToast(toastIdRef.current);
      toastIdRef.current = null;
    }
  };

  useEffect(() => {
    handleToastDisplay(isLateralPosCorrect, lateralPosToastId, ToastMessages.LATERAL_WRONG, ToastTypes.Error);
  }, [isLateralPosCorrect]);

  useEffect(() => {
    handleToastDisplay(landmarksVisible, landmarksVisToastId, ToastMessages.LANDMARKS_NOT_VISIBLE, ToastTypes.Error);
  }, [landmarksVisible]);

  return <Toast />;
};
