import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useState } from "react";

interface ContinousSliderProps {
  label: string;
  step: number;
  min: number;
  max: number;
  defaultValue: number;
  onValueChange: (value: number) => void;
  disabled: boolean;
}

export const ContinousSlider = ({
  label,
  step,
  min,
  max,
  defaultValue,
  onValueChange,
  disabled,
}: ContinousSliderProps) => {
  const [sliderValue, setSliderValue] = useState<number>(defaultValue);

  const handleChange = (event: Event, value: number | number[], activeThumb: number) => {
    if (typeof value === "number") {
      setSliderValue(value);
      if (onValueChange) {
        onValueChange(value);
      }
    }
  };

  return (
    <Box sx={{ width: "100%", color: "#fff", flexDirection: "column" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography>{label}</Typography>
        <Typography>{sliderValue}</Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <Slider
          aria-label="Custom marks"
          defaultValue={defaultValue}
          value={sliderValue}
          step={step}
          min={min}
          max={max}
          disabled={disabled}
          sx={{
            "&.MuiSlider-root": {
              width: "100%",
              color: "#6c5dd3",
            },
            "& .MuiSlider-markLabel": {
              color: "#fff",
            },
            "&.Mui-disabled": {
              color: "#a8a8a8",
              "& $rail": {
                backgroundColor: "#d1d1d1",
              },
              "& $track": {
                backgroundColor: "#a8a8a8",
              },
            },
          }}
          onChange={handleChange}
        />
      </Box>
    </Box>
  );
};
