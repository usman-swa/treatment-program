import { addDays, endOfMonth, startOfMonth, startOfWeek } from 'date-fns';

import { getCalendarDays } from './dateUtils';

describe('getCalendarDays', () => {
    it('should generate an array of Date objects for the days in the calendar month', () => {
        const currentMonth = new Date(2023, 9, 1); // October 2023
        const days = getCalendarDays(currentMonth);

        const start = startOfMonth(currentMonth);
        const end = endOfMonth(currentMonth);
        const startWeek = startOfWeek(start, { weekStartsOn: 1 }); // Week starts on Monday

        let expectedDays: Date[] = [];
        let day = startWeek;
        while (day <= end) {
            expectedDays.push(day);
            day = addDays(day, 1);
        }

        expect(days).toEqual(expectedDays);
    });

    it('should start from the first day of the week that contains the first day of the month', () => {
        const currentMonth = new Date(2023, 9, 1); // October 2023
        const days = getCalendarDays(currentMonth);

        const firstDayOfWeek = days[0];
        expect(firstDayOfWeek.getDay()).toBe(1); // Week starts on Monday
    });

    it('should handle months with different lengths correctly', () => {
        const shortMonth = new Date(2023, 1, 1); // February 2023
        const longMonth = new Date(2023, 0, 1); // January 2023

        const shortMonthDays = getCalendarDays(shortMonth);
        const longMonthDays = getCalendarDays(longMonth);

        expect(shortMonthDays.length).toBeLessThan(longMonthDays.length);
    });
});