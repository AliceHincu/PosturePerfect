export enum NotificationMessage {
  BREAK_ALERT = "Break Alert",
  WATER_ALERT = "Water Alert",
  POSTURE_ALERT = "Posture Alert",
}

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

export const SECOND = "1";
export const MINUTE_TO_SECONDS = "60";
export const HOUR_TO_SECONDS = "3600";

export const initialNotificationValues: NotificationValues = {
  timeValuePosture: 15,
  timeUnitPosture: 1,
  checkboxPosture: true,
  timeValueBreak: 20,
  timeUnitBreak: +MINUTE_TO_SECONDS,
  checkboxBreak: true,
  timeValueWater: 30,
  timeUnitWater: +MINUTE_TO_SECONDS,
  checkboxWater: true,
};

const NotificationIcons: Record<NotificationMessage, string> = {
  [NotificationMessage.BREAK_ALERT]: "notification-icons/break.svg",
  [NotificationMessage.WATER_ALERT]: "notification-icons/water.svg",
  [NotificationMessage.POSTURE_ALERT]: "notification-icons/posture.svg",
};

/**
 * Construct and send the notification
 * @param {NotificationMessage} message break/water/posture alert
 */
export const notify = (message: NotificationMessage | string) => {
  let key: string;

  if (typeof message === "string") {
    key = NotificationMessage.POSTURE_ALERT;
  } else {
    key = message;
  }

  let icon = NotificationIcons[key as NotificationMessage];
  const options = icon ? { icon } : {};
  new Notification(message, options);
};
