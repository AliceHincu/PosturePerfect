export const WeekDayHeader = () => {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  return (
    <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500">
      {days.map((day, index) => (
        <div key={index}>{day}</div>
      ))}
    </div>
  );
};
