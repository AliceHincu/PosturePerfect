import React from "react";

interface CameraSelectProps {
  devices: { deviceId: string; label?: string }[];
  onChange: (deviceId: string) => void;
}

const CameraSelect = ({ devices, onChange }: CameraSelectProps) => {
  const cameras = devices.map((device, index) => (
    <option key={index} value={device.deviceId}>
      {device.label || `Camera ${index + 1}`}
    </option>
  ));

  return (
    <select onChange={(event) => onChange(event.target.value)} className="select-posture-analysis">
      {cameras}
    </select>
  );
};

export default CameraSelect;
