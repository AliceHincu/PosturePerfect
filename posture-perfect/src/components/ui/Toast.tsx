import { ToastContainer, ToastPosition, Theme, toast } from "react-toastify";

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
      rtl={false}
      pauseOnFocusLoss={false}
      draggable={false}
      theme="colored"
    />
  );
};

export enum ToastTypes {
  Error = "error",
  Info = "info",
}

/**
 * Generate a toast to inform the user about something/error
 * @param {string} message
 * @param {ToastTypes} type
 * @returns
 */
export const generateToast = (message: string, type: ToastTypes) => {
  const toastOptions = {
    position: "top-center" as const,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "colored" as const,
    className: `toast-custom-${type}`,
  };

  switch (type) {
    case ToastTypes.Error:
      return toast.error(message, { ...toastOptions, autoClose: false, closeButton: false });
    case ToastTypes.Info:
      return toast.info(message, { ...toastOptions, autoClose: 5000 });
    default:
      return null;
  }
};

export enum ToastMessages {
  //errors
  LATERAL_WRONG = "You are not positioned correctly - reposition to a 90 angle",
  LANDMARKS_NOT_VISIBLE = "Can't see the whole posture - make sure that the hips(only for lateral), shoulders, head are visible on camera",

  // info
  FORM_SUBMITTED = "Values changed",
}
