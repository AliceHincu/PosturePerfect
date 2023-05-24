import React, { useEffect, useRef } from "react";
import { Id, toast } from "react-toastify";
import { ToastType, generateToast, Toast, ToastMessages } from "./ui/Toast";
import { PostureView } from "../utils/posture-utils";
import { useAppSelector } from "../redux/hooks";

interface ToastManagerProps {
  // postureView: PostureView;
  isLateralPosCorrect: boolean;
  landmarksVisible: boolean;
}

/**
 * If there are any errors regarding the setup for the analysis of the posture, toasts will show up informing the user about the problem
 * @param isLateralPosCorrect - if the user has a 90 degree of their posture from the camera point of view
 * @param landmarksVisible - if all the necessary landmarks are visible
 * @returns
 */
export const ToastManager: React.FC<ToastManagerProps> = ({
  // postureView,
  isLateralPosCorrect,
  landmarksVisible,
}) => {
  const postureView = useAppSelector((state) => state.posture.postureView);
  const lateralPosToastId = useRef<Id | null>(null);
  const landmarksVisToastId = useRef<Id | null>(null);

  const removeToast = (toastId: any) => {
    toast.dismiss(toastId);
  };

  const handleToastDisplay = (
    isVisible: boolean,
    toastIdRef: React.MutableRefObject<Id | null>,
    alertMessage: ToastMessages,
    toastType: ToastType
  ) => {
    if (!isVisible) {
      toastIdRef.current = generateToast(alertMessage, toastType);
    } else if (toastIdRef.current) {
      removeToast(toastIdRef.current);
      toastIdRef.current = null;
    }
  };

  useEffect(() => {
    if (postureView === PostureView.LATERAL)
      handleToastDisplay(isLateralPosCorrect, lateralPosToastId, ToastMessages.LATERAL_WRONG, ToastType.Error);
  }, [isLateralPosCorrect]);

  useEffect(() => {
    if (postureView === PostureView.LATERAL)
      handleToastDisplay(landmarksVisible, landmarksVisToastId, ToastMessages.LANDMARKS_NOT_VISIBLE, ToastType.Error);
  }, [landmarksVisible]);

  return <Toast />;
};
