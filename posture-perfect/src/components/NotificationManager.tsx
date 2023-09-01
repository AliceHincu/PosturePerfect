import { useState, useEffect } from "react";
import { NotificationMessage, NotificationValues, notify } from "../utils/notifications-utils";

interface NotificationManagerProps {
  notificationValues: NotificationValues;
}

/**
 * The logic for break and water notifications
 * @param {NotificationManagerProps} param
 * @returns
 */
export const NotificationManager = ({ notificationValues }: NotificationManagerProps) => {
  const [intervalIds, setIntervalIds] = useState<{
    alert?: ReturnType<typeof setInterval>;
    break?: ReturnType<typeof setInterval>;
    water?: ReturnType<typeof setInterval>;
  }>({});

  useEffect(() => {
    // clear old intervals
    intervalIds.break && clearInterval(intervalIds.break);
    intervalIds.water && clearInterval(intervalIds.water);

    // new break notification interval
    let idBreak: any;
    let idWater: any;

    // only if the user wants to receive the notifications the interval will change
    if (notificationValues.checkboxBreak) {
      idBreak = setInterval(() => {
        sendNotification(NotificationMessage.BREAK_ALERT);
      }, notificationValues.timeValueBreak * notificationValues.timeUnitBreak * 1000);
    }
    if (notificationValues.checkboxWater) {
      idWater = setInterval(() => {
        sendNotification(NotificationMessage.WATER_ALERT);
      }, notificationValues.timeValueWater * notificationValues.timeUnitWater * 1000);
    }
    setIntervalIds({ break: idBreak, water: idWater });

    return () => {
      clearInterval(idBreak);
      clearInterval(idWater);
    };
  }, [
    notificationValues.timeValueBreak,
    notificationValues.timeUnitBreak,
    notificationValues.checkboxBreak,
    notificationValues.timeValueWater,
    notificationValues.timeUnitWater,
    notificationValues.checkboxWater,
  ]);

  return null;
};

/**
 * Checks is enough time has passed since the last posture alter to see if another alert can be sent
 * @param lastNotificationTime - the last time a notification was sent
 * @param notificationValues - structure which contains the alert values for posture
 * @returns
 */
export const canNotifyPosture = (
  lastNotificationTime: React.MutableRefObject<Date | null>,
  notificationValues: NotificationValues
) => {
  if (!notificationValues.checkboxPosture) {
    return false;
  }

  const minimumIntervalTime = notificationValues.timeValuePosture * notificationValues.timeUnitPosture * 1000;
  const currentTime = new Date();

  if (
    !lastNotificationTime.current ||
    currentTime.getTime() - lastNotificationTime.current.getTime() >= minimumIntervalTime
  ) {
    lastNotificationTime.current = currentTime;
    return true;
  }

  return false;
};

/**
 * Send a notification to the user depending on the permissions
 * @param {NotificationMessage} message break/water/posture alert
 */
export const sendNotification = (message: NotificationMessage | string) => {
  // Check if the browser supports notifications
  if (!("Notification" in window)) {
    console.log("This browser does not support system notifications");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    notify(message);
  }
  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        notify(message);
      }
    });
  }
};
