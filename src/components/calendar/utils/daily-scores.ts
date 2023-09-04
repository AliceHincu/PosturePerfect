import { differenceInMinutes, format, parseISO } from "date-fns";
import { PostureScore } from "../Calendar";

// interface DailyScoreData {
//   totalWeightedScore: number;
//   totalDuration: number;
// }

/**
 * Weighted Average: If each analysis session varies in length (e.g., one session lasts 10 minutes and another 30 minutes),
 * you should calculate a weighted average. This takes into account the duration of each session when averaging the scores.
 * @param {PostureScore} dailyScores
 * @returns score
 */
export const calculateDailyWeightedScore = (dailyScores: PostureScore[]) => {
  let totalWeightedScore = 0;
  let totalDuration = 0;

  dailyScores.forEach((session: PostureScore) => {
    const sessionDuration = differenceInMinutes(parseISO(session.endTime), parseISO(session.startTime));
    totalWeightedScore += session.score * sessionDuration;
    totalDuration += sessionDuration;
  });

  return totalWeightedScore / totalDuration;
};
