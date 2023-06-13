import { useState, useEffect, useRef } from "react";

export enum NotificationMessage {
  BREAK_ALERT = "Break Alert",
  WATER_ALERT = "Water Alert",
  POSTURE_ALERT = "Posture Alert",
}

const NotificationIcons: Record<NotificationMessage, string> = {
  [NotificationMessage.BREAK_ALERT]: "notification-icons/break.svg",
  [NotificationMessage.WATER_ALERT]: "notification-icons/water.svg",
  [NotificationMessage.POSTURE_ALERT]: "notification-icons/posture.svg",
};

export interface NotificationValues {
  timeValuePosture: number;
  timeUnitPosture: number;
  checkboxPosture: boolean;
  timeValueBreak: number;
  timeUnitBreak: number;
  checkboxBreak: boolean;
  timeValueWater: number;
  timeUnitWater: number;
  checkboxWater: boolean;
}

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
export const sendNotification = (message: NotificationMessage) => {
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

/**
 * Construct and send the notification
 * @param {NotificationMessage} message break/water/posture alert
 */
const notify = (message: NotificationMessage) => {
  let icon = NotificationIcons[message];
  const options = icon ? { icon } : {};
  new Notification(message, options);
};
