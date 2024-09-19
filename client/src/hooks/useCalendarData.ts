import { Activity, SET_ACTIVITIES } from "../context/CalendarContext";
import { addDays, isAfter, isBefore, isSameDay } from "date-fns";

import { ApiCreateActivityPost201Response } from "../api";
import { TreatmentProgram } from "../types";
import { useEffect } from "react";

/**
 * Custom hook to process and manage calendar data for a treatment program.
 *
 * @param {ApiCreateActivityPost201Response} programData - The data of the treatment program containing activities.
 * @param {Date} today - The current date to compare activities against.
 * @param {any} dispatch - The dispatch function to update the global state with processed activities.
 *
 * @returns {void}
 *
 * @remarks
 * This hook processes the treatment program data to categorize activities into overdue, future, and current activities.
 * It then dispatches the processed activities to update the global state.
 *
 * @example
 * ```typescript
 * const programData = fetchProgramData();
 * const today = new Date();
 * const dispatch = useDispatch();
 * useCalendarData(programData, today, dispatch);
 * ```
 */
const useCalendarData = (programData: ApiCreateActivityPost201Response, today: Date, dispatch: any) => {
  useEffect(() => {
    if (!programData) {
      console.warn("No programData available");
      return;
    }

    console.log("Program Data:", programData);

    const treatmentProgram = programData as TreatmentProgram;
    const allActivities: Activity[] = [];

    const baseDate = new Date(2024, 8, 2); // Adjust base date if needed

    Object.keys(treatmentProgram).forEach((week) => {
      const weekNumber = parseInt(week.replace("week", ""), 10);
      const weekStartDate = addDays(baseDate, (weekNumber - 36) * 7);

      (treatmentProgram[week] as ApiCreateActivityPost201Response[]).forEach(
        (activity) => {
          const dayIndex = [
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY",
            "SATURDAY",
            "SUNDAY",
          ].indexOf(activity.weekday?.toUpperCase() || "");

          if (dayIndex === -1) {
            console.warn("Invalid weekday:", activity.weekday);
            return;
          }

          const activityDate = addDays(weekStartDate, dayIndex);
          console.log("Activity Date:", activityDate);

          let title = activity.title;
          if (!activity.completed && isBefore(activityDate, today)) {
            // Mark overdue activities
            title += " (overdue)";
            allActivities.push({
              date: today, // Move overdue activity to today
              id: activity.id,
              week: activity.week,
              weekday: activity.weekday,
              title,
              completed: false,
            });
          } else if (isAfter(activityDate, today)) {
            // Handle future activities
            title += " (future)";
            allActivities.push({
              date: activityDate,
              id: activity.id,
              week: activity.week,
              weekday: activity.weekday,
              title,
              completed: activity.completed,
            });
          } else {
            // Handle activities that are neither overdue nor future
            allActivities.push({
              date: activityDate,
              id: activity.id,
              week: activity.week,
              weekday: activity.weekday,
              title,
              completed: activity.completed,
            });
          }
        }
      );
    });

    console.log("Processed Activities:", allActivities); // Log to see what is being processed

    dispatch({ type: SET_ACTIVITIES, payload: allActivities }); // Update global state
  }, [programData, today, dispatch]);
};

export default useCalendarData;