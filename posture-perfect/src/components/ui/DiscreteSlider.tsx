import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useState } from "react";

interface DiscreteSliderMarksProps {
  values: string[];
  defaultValue: string;
  onValueChange: (value: string) => void;
  disabled: boolean;
}

export default function DiscreteSlider({ values, defaultValue, onValueChange, disabled }: DiscreteSliderMarksProps) {
  const step = 100 / (values.length - 1);

  const defaultIndex = values.indexOf(defaultValue);
  const defaultNumericValue = defaultIndex !== -1 ? defaultIndex * step : 0;

  const [sliderValue, setSliderValue] = useState<number>(defaultNumericValue);

  const marks = values.map((value, index) => ({
    value: index * step,
    label: value,
  }));

  const handleChange = (event: Event, value: number | number[], activeThumb: number) => {
    if (typeof value === "number") {
      // Handle the value for a single-thumb slider
      const selectedLabel = values[Math.round(value / (100 / (values.length - 1)))];
      setSliderValue(value); // Set the current value for the slider
      onValueChange(selectedLabel);
    } else {
      // Handle the value for a range slider
    }
  };

  return (
    <Box sx={{ width: "100%", color: "#fff", display: "flex", justifyContent: "center" }}>
      <Slider
        aria-label="Custom marks"
        value={sliderValue}
        defaultValue={defaultNumericValue}
        step={step}
        marks={marks}
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
            // Styles for the disabled state of Slider
            color: "#a8a8a8", // This is a gray color for example, change it as you see fit
            "& $rail": {
              backgroundColor: "#d1d1d1", // Light gray for the rail when disabled
            },
            "& $track": {
              backgroundColor: "#a8a8a8", // Match the track color with thumb color when disabled
            },
          },
        }}
        onChange={handleChange}
      />
    </Box>
  );
}
