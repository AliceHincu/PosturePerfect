import { Toggle, Slider, StaticText } from "@mediapipe/control_utils";

/**
 * Toggle between yes and no
 * @param {string} title Name of the property in the GUI
 * @param {string} field Name of the property in the Holistic config
 * @returns {Toggle}
 */
const toggle = (title: string, field: string): Toggle => {
  return new Toggle({
    title,
    field,
  });
};

/**
 * Slider between values
 * @param {string} title Name of the property in the GUI
 * @param {string} field Name of the property in the Holistic config
 * @param {[number, number]} range Range of values for the field
 * @param {number} step Step for intervals
 * @param {string[] | { [key: string]: string }} discrete The object keys are the slider values, and the corresponding object values are the labels to be displayed for those values
 * @returns {Slider}
 */
const slider = (
  title: string,
  field: string,
  range?: [number, number],
  step?: number,
  discrete?: string[] | { [key: string]: string }
): Slider => {
  const sliderOptions: any = {
    title,
    field,
  };

  if (range) {
    sliderOptions.range = range;
  }

  if (step) {
    sliderOptions.step = step;
  }

  if (discrete) {
    sliderOptions.discrete = discrete;
  }

  return new Slider(sliderOptions);
};

/**
 * Text to show in gui
 * @param title Name of the property in the GUI
 * @returns {StaticText}
 */
const text = (title: string): StaticText => {
  return new StaticText({ title });
};

export { toggle, slider, text };
