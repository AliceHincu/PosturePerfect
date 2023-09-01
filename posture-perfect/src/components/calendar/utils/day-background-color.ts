export const getBackgroundColor = (score: number) => {
  const hue = Math.round((score / 100) * 120);
  return `hsl(${hue}, 100%, 50%)`;
};
