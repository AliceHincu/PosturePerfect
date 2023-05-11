/**
 * Determine the offset distance between two points.
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns
 */
const findDistance = (x1: number, y1: number, x2: number, y2: number): number => {
  const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  return dist;
};

/**
 * Calculate angle between two points
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns
 */
const findAngle = (x1: number, y1: number, x2: number, y2: number): number => {
  const theta = Math.acos(((y2 - y1) * -y1) / (Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) * y1));
  const degree = Math.round(180 / Math.PI) * theta;
  return degree;
};

export { findDistance, findAngle };
