import { addDays, endOfMonth, isSameMonth, startOfMonth, startOfWeek } from "date-fns";

export const getFilledDays = (currentMonth: Date) => {
  const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
  const end = endOfMonth(currentMonth);
  const days: (Date | null)[] = [];
  let day = start;
  while (day <= end) {
    days.push(day);
    day = addDays(day, 1);
  }
  return days.filter((date): date is Date => date !== null && isSameMonth(date, currentMonth));
};
