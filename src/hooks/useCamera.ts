// useCamera.ts
import { useState, useEffect, useCallback } from "react";

export interface Device {
  deviceId: string;
  label?: string;
  kind: string;
}

const useCamera = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceId, setDeviceId] = useState<string>("");
  const [userMediaGranted, setUserMediaGranted] = useState<boolean>(false);

  const fetchDevices = useCallback(() => {
    navigator.mediaDevices.enumerateDevices().then((deviceList) => {
      setDevices(deviceList.filter((device) => device.kind === "videoinput"));
    });
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  useEffect(() => {
    if (userMediaGranted) {
      fetchDevices();
    }
  }, [userMediaGranted, fetchDevices]);

  const onUserMedia = useCallback(() => {
    setUserMediaGranted(true);
  }, []);

  return { devices, deviceId, setDeviceId, onUserMedia };
};

export default useCamera;
