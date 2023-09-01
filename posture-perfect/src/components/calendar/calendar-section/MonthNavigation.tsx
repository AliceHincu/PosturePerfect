import { format } from "date-fns";
import MonthNavigationButton, { MonthButtonEnum } from "./MonthNavigationButton";

interface MonthNavigationProps {
  firstDayCurrentMonth: Date;
  previousMonth: () => void;
  nextMonth: () => void;
}

const MonthNavigation = ({ firstDayCurrentMonth, previousMonth, nextMonth }: MonthNavigationProps) => (
  <div className="flex items-center">
    <h2 className="flex-auto font-semibold text-gray-900">{format(firstDayCurrentMonth, "MMMM yyyy")}</h2>
    <MonthNavigationButton direction={MonthButtonEnum.PREV} onClick={previousMonth} />
    <MonthNavigationButton direction={MonthButtonEnum.NEXT} onClick={nextMonth} />
  </div>
);

export default MonthNavigation;
