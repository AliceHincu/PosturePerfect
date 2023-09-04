import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { NotificationValues } from "../../utils/notifications-utils";
import { NotificationsForm } from "../form/NotificationsForm";
import { NotificationManager } from "../NotificationManager";
import { generateToast, Toast, ToastMessages, ToastType } from "../ui/Toast";
import "./controllers.css";

import { ToastContainer, toast } from "react-toastify";

interface NotificationControllerProps {
  notificationValues: NotificationValues;
  setNotificationValues: Dispatch<SetStateAction<NotificationValues>>;
}

export const NotificationController = ({ notificationValues, setNotificationValues }: NotificationControllerProps) => {
  const handleFormSubmit = (values: NotificationValues) => {
    setNotificationValues(values);
    generateToast(ToastMessages.FORM_SUBMITTED, ToastType.Info);
  };

  return (
    <div className="card-bottom">
      <NotificationsForm handleFormSubmit={handleFormSubmit}></NotificationsForm>
      <NotificationManager notificationValues={notificationValues} />
      <ToastContainer />
    </div>
  );
};
