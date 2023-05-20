import { useState, useEffect } from "react";

export interface NotificationValues {
  timeValueAlert: number;
  timeUnitAlert: number;
  timeValueBreak: number;
  timeUnitBreak: number;
  timeValueWater: number;
  timeUnitWater: number;
}

interface NotificationManagerProps {
  notificationValues: NotificationValues;
}

/**
 * The logic for notifications
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
    // new break notification interval
    intervalIds.break && clearInterval(intervalIds.break);
    intervalIds.water && clearInterval(intervalIds.water);

    const idBreak = setInterval(() => {
      sendNotification("Break Alert");
    }, notificationValues.timeValueBreak * notificationValues.timeUnitBreak * 1000);
    const idWater = setInterval(() => {
      sendNotification("Water Alert");
    }, notificationValues.timeValueWater * notificationValues.timeUnitWater * 1000);

    setIntervalIds({ break: idBreak, water: idWater });

    return () => {
      clearInterval(idBreak);
      clearInterval(idWater);
    };
  }, [
    notificationValues.timeValueBreak,
    notificationValues.timeUnitBreak,
    notificationValues.timeValueWater,
    notificationValues.timeUnitWater,
  ]);

  return null;
};

export const sendNotification = (message: string) => {
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

const notify = (message: string) => {
  let icon = "";
  if (message.includes("Water")) icon = "notification-icons/water.svg";
  else if (message.includes("Break")) icon = "notification-icons/break.svg";
  else if (message.includes("Posture")) icon = "notification-icons/posture.svg";

  const options = icon ? { icon } : {};
  const notification = new Notification(message, options);
};
