import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import "./MonthNavigationButton.css";

export enum MonthButtonEnum {
  PREV,
  NEXT,
}

interface MonthNavigationButtonProps {
  direction: MonthButtonEnum;
  onClick: () => void;
}

export const MonthNavigationButton = ({ direction, onClick }: MonthNavigationButtonProps) => {
  const getIcon = () => {
    if (direction === MonthButtonEnum.PREV) {
      return <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />;
    }
    return <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />;
  };

  const getCss = (): string => {
    return `month-nav-button ${direction === MonthButtonEnum.NEXT ? "right-dir" : ""}`;
  };

  const getScreenReaderText = () => {
    return direction === MonthButtonEnum.PREV ? "Previous month" : "Next month";
  };

  return (
    <button type="button" onClick={onClick} className={getCss()}>
      <span className="sr-only">{getScreenReaderText()}</span>
      {getIcon()}
    </button>
  );
};

export default MonthNavigationButton;
