import { parseISO, format } from "date-fns";
import { PostureScore } from "../Calendar";
import { getBackgroundColor } from "../utils/day-background-color";

interface PostureScoreDetailProps {
  postureScore: PostureScore;
  startDateTime: Date;
  endDateTime: Date;
}

const PostureScoreDetail = ({ postureScore }: PostureScoreDetailProps) => {
  let startDateTime = parseISO(postureScore.startTime);
  let endDateTime = parseISO(postureScore.endTime);

  return (
    <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
      <div
        className="flex-none w-10 h-10 rounded-full"
        style={{
          backgroundColor: getBackgroundColor(postureScore.score),
        }}
      />
      <div className="flex-auto">
        <p className="text-gray-900">{postureScore.score}</p>
        <p className="mt-0.5">
          <time dateTime={postureScore.startTime}>{format(startDateTime, "h:mm a")}</time> -{" "}
          <time dateTime={postureScore.endTime}>{format(endDateTime, "h:mm a")}</time>
        </p>
      </div>
    </li>
  );
};

export default PostureScoreDetail;
