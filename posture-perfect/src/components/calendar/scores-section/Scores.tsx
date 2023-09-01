import { format, parseISO } from "date-fns";
import { PostureScore } from "../Calendar";
import PostureScoreDetail from "./PostureScoreDetail";
import { calculateDailyWeightedScore } from "../utils/daily-scores";

interface ScoresProps {
  selectedDay: Date;
  dailyScores: PostureScore[];
  // dailyWeightedScore: number;
}

const Scores = ({ selectedDay, dailyScores }: ScoresProps) => {
  const weightedScore = calculateDailyWeightedScore(dailyScores);

  return (
    <section className="mt-12 md:mt-0 md:pl-14">
      <h2 className="font-semibold text-gray-900">
        Schedule for <time dateTime={format(selectedDay, "yyyy-MM-dd")}>{format(selectedDay, "MMM dd, yyy")}</time>
      </h2>
      {weightedScore && <p className="text-gray-700 mt-2">Weighted Score: {weightedScore}</p>}
      <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
        {dailyScores.length > 0 ? (
          dailyScores.map((postureScore) => (
            <PostureScoreDetail
              postureScore={postureScore}
              startDateTime={parseISO(postureScore.startTime)}
              endDateTime={parseISO(postureScore.endTime)}
              key={postureScore.id}
            />
          ))
        ) : (
          <li>No scores for today.</li>
        )}
      </ol>
    </section>
  );
};

export default Scores;
