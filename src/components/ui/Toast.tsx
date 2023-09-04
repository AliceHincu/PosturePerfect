import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
/**
 * Container for the error/info toasts
 * @returns
 */
export const Toast = () => {
  return (
    <ToastContainer
      position="top-center"
      newestOnTop
      closeOnClick={false}
      closeButton={false} // Add this line to remove close button globally
      rtl={false}
      pauseOnFocusLoss={false}
      draggable={false}
      theme="colored"
    />
  );
};

export enum ToastType {
  Error = "error",
  Info = "info",
  Warning = "warning",
}

/**
 * Generate a toast to inform the user about something/error
 * @param {string} message
 * @param {ToastType} type
 * @returns
 */
export const generateToast = (message: string, type: ToastType) => {
  const toastOptions = {
    position: "top-center" as const,
    hideProgressBar: false,
    closeOnClick: false,
    closeButton: false,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "colored" as const,
    className: `toast-custom-${type}`,
  };

  switch (type) {
    case ToastType.Error:
      return toast.error(message, { ...toastOptions, autoClose: false });
    case ToastType.Info:
      return toast.info(message, { ...toastOptions, autoClose: 5000 });
    case ToastType.Warning:
      return toast.warning(message, { ...toastOptions, autoClose: 5000 });
    default:
      return null;
  }
};

export enum ToastMessages {
  //errors
  LATERAL_WRONG = "You are not positioned correctly - reposition to a 90 angle",
  LANDMARKS_NOT_VISIBLE = "Can't see the whole posture - make sure that the head, the shoulders and the hips are visible on camera",

  // info
  FORM_SUBMITTED = "Values changed",
  CALIBRATED = "Posture calibrated",
  STARTED_CORRECTION = "Analysis of posture in progress...",
  STOPPED_CORRECTION = "Stopping analysis of posture...",

  // warning
  NOT_CALIBRATED = "Please calibrate before starting",
}
