import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
} from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import "./Calendar.css";
import CalendarGrid from "./calendar-section/CalendarGrid";
import MonthNavigation from "./calendar-section/MonthNavigation";
import { WeekDayHeader } from "./calendar-section/WeekDayHeader";
import Scores from "./scores-section/Scores";
import { calculateDailyWeightedScore } from "./utils/daily-scores";
import { getBackgroundColor } from "./utils/day-background-color";
import { getPostureScoresByToken, getPostureScoresByTokenAndDate } from "../../api/postureScores";
import { useAuth } from "../../context/authContext";

export interface PostureScore {
  id: number;
  score: number;
  startTime: string;
  endTime: string;
}

export const classNames = (...classes: any) => {
  return classes.filter(Boolean).join(" ");
};

const Calendar = () => {
  const today = startOfToday();
  const initialMonth = format(today, "MMM-yyyy");
  const realCurrentMonth = parse(initialMonth, "MMM-yyyy", new Date());
  let [calendarCurrentMonth, setCurrentMonth] = useState(initialMonth);
  const firstDayCurrentMonth = useMemo(
    () => parse(calendarCurrentMonth, "MMM-yyyy", new Date()),
    [calendarCurrentMonth]
  );

  // const [dailyWeightedScores, setDailyWeightedScores] = useState<Record<string, number>>({}); // scores for the days

  // for each month, call the api to return the score in that month. the arrows will also make api calls everytime they are clicked.
  const [postureScores, setPostureScores] = useState<PostureScore[]>([]);
  const [dailyScores, setDailyScores] = useState<PostureScore[]>([]);
  const [selectedDay, setSelectedDay] = useState(today);

  const { token } = useAuth();

  // Fetch initial posture scores by User ID
  useEffect(() => {
    const fetchInitialData = async () => {
      const fetchedData = await getPostureScoresByToken(token as string);
      if (fetchedData) {
        setPostureScores(fetchedData);
      }
    };
    fetchInitialData();
  }, []); // Empty dependency array to fetch data only once when component mounts

  // useEffect(() => {
  //   const fetchScoresByDate = async () => {
  //     const date = format(selectedDay, "yyyy-MM-dd");
  //     const fetchedData = await getPostureScoresByTokenAndDate(token as string, date);
  //     if (fetchedData) {
  //       setDailyScores(fetchedData);
  //     }
  //   };
  //   fetchScoresByDate();
  // }, [selectedDay]);
  // Filter scores for the selected day from postureScores
  useEffect(() => {
    const filteredScores = postureScores.filter((score) => {
      const scoreDate = parseISO(score.startTime);
      return isSameDay(scoreDate, selectedDay);
    });
    setDailyScores(filteredScores);
  }, [selectedDay, postureScores]);

  const setMonth = (difference: number) => {
    let newMonth = add(firstDayCurrentMonth, { months: difference });
    setCurrentMonth(format(newMonth, "MMM-yyyy"));
  };

  const previousMonth = () => setMonth(-1);
  const nextMonth = () => setMonth(1);

  const daysOfMonth = useMemo(
    () =>
      eachDayOfInterval({
        start: firstDayCurrentMonth,
        end: endOfMonth(firstDayCurrentMonth),
      }),
    [firstDayCurrentMonth]
  );

  /**
   * Returns a set of CSS class names (as a string) based on certain conditions related to the given day.
   * The function will be called for each day in the calendar, and its purpose is to dynamically determine
   * which CSS classes should be applied to each day, depending on various conditions.
   */
  const getDayClasses = useCallback(
    (day: Date) => {
      const isDaySelected = isEqual(day, selectedDay);
      const isDayToday = isToday(day);
      const isDayInCurrentMonth = isSameMonth(day, realCurrentMonth);

      const conditions = [
        [isDaySelected, "text-white"],
        [!isDaySelected && isDayInCurrentMonth, "text-gray-900"],
        [!isDaySelected && !isDayToday && !isDayInCurrentMonth, "text-gray-400"],
        [isDaySelected, "bg-gray-900"],
        [!isDaySelected, "hover:bg-gray-200"],
        [isDaySelected || isDayToday, "font-semibold"],
        [true, "mx-auto flex h-8 w-8 items-center justify-center rounded-full"],
      ];

      const classes = conditions.filter(([condition]) => condition).map(([, className]) => className);

      return classNames(...classes);
    },
    [selectedDay, firstDayCurrentMonth]
  );

  const [dayStyles, setDayStyles] = useState<Record<string, React.CSSProperties>>({});

  // useEffect(() => {
  //   // Run your async function to update the dayStyles state
  //   const fetchDayStyles = async () => {
  //     const newDayStyles: Record<string, React.CSSProperties> = {};
  //     for (const day of daysOfMonth) {
  //       const dayStr = format(day, "yyyy-MM-dd");
  //       const dayScores = await getPostureScoresByTokenAndDate(token as string, dayStr);
  //       if (dayScores.length > 0) {
  //         newDayStyles[dayStr] = { backgroundColor: getBackgroundColor(calculateDailyWeightedScore(dayScores)) };
  //       }
  //     }
  //     setDayStyles(newDayStyles);
  //   };

  //   fetchDayStyles();
  // }, [daysOfMonth]);
  // Filter and process scores to determine the style for each day of the current month
  useEffect(() => {
    const newDayStyles: Record<string, React.CSSProperties> = {};
    for (const day of daysOfMonth) {
      const dayStr = format(day, "yyyy-MM-dd");
      const dayScores = postureScores.filter((score) => {
        const scoreDate = parseISO(score.startTime);
        return isSameDay(scoreDate, day);
      });
      if (dayScores.length > 0) {
        newDayStyles[dayStr] = { backgroundColor: getBackgroundColor(calculateDailyWeightedScore(dayScores)) };
      }
    }
    setDayStyles(newDayStyles);
  }, [daysOfMonth, postureScores]);

  return (
    <div className="pt-16">
      <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
        <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
          <div className="md:pr-14">
            <MonthNavigation
              firstDayCurrentMonth={firstDayCurrentMonth}
              previousMonth={previousMonth}
              nextMonth={nextMonth}
            />
            <WeekDayHeader />
            <CalendarGrid
              days={daysOfMonth}
              setSelectedDay={setSelectedDay}
              getDayClasses={getDayClasses}
              dayStyles={dayStyles}
              postureScores={postureScores}
            />
          </div>
          <Scores selectedDay={selectedDay} dailyScores={dailyScores}></Scores>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
