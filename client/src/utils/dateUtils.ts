import { addDays, endOfMonth, startOfMonth, startOfWeek } from "date-fns";

/**
 * Generates an array of Date objects representing the days in the calendar month
 * for the given date, starting from the first day of the week that contains the
 * first day of the month.
 *
 * @param currentMonth - The date object representing the current month.
 * @returns An array of Date objects representing the days in the calendar month.
 */
export const getCalendarDays = (currentMonth: Date) => {
  const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
  const end = endOfMonth(currentMonth);

  const days: (Date | null)[] = [];
  let day = start;
  while (day <= end) {
    days.push(day);
    day = addDays(day, 1);
  }

  return days.filter((date): date is Date => date !== null);
};