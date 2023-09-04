import { format, getDay, isToday } from "date-fns";
import { PostureScore, classNames } from "../Calendar";

interface CalendarGridProps {
  days: Date[];
  setSelectedDay: (day: Date) => void;
  getDayClasses: (day: Date) => string;
  dayStyles: any;
  postureScores: PostureScore[];
}

// apply CSS classes that adjust the starting column of the first day of the week in the calendar grid.
let colStartClasses = ["", "col-start-2", "col-start-3", "col-start-4", "col-start-5", "col-start-6", "col-start-7"];

const CalendarGrid = ({ days, setSelectedDay, getDayClasses, dayStyles, postureScores }: CalendarGridProps) => {
  const getColumnCss = (day: Date, dayIdx: number) =>
    classNames(dayIdx === 0 && colStartClasses[getDay(day)], "py-1.5");

  return (
    <div className="grid grid-cols-7 mt-2 text-sm">
      {days.map((day, dayIdx) => (
        <div key={day.toString()} className={getColumnCss(day, dayIdx)}>
          <button
            type="button"
            onClick={() => setSelectedDay(day)}
            className={getDayClasses(day)}
            style={dayStyles[format(day, "yyyy-MM-dd")]}
          >
            {/* screen readers */}
            <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
          </button>

          {isToday(day) && <ShowCircularIndicator></ShowCircularIndicator>}
        </div>
      ))}
    </div>
  );
};
export default CalendarGrid;

// shows a circular indicator if the the selected is the current day.
const ShowCircularIndicator = () => {
  return (
    <div className="w-1 h-1 mx-auto mt-1">
      <div className="w-1 h-1 rounded-full bg-sky-500"></div>
    </div>
  );
};
