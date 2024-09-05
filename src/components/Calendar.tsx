import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  addDays,
  endOfMonth,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import styled from "styled-components";
import treatmentData from "../data/treatmentProgram.json";

interface Activity {
  weekday: string;
  title: string;
  completed: boolean;
}

interface TreatmentProgram {
  [key: string]: Activity[];
}

const CalendarContainer = styled.div`
  background-color: white;
  border: 4px solid rgb(93, 175, 116);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  margin: 24px auto 0;
  max-width: 1200px;
  padding: 0;
  width: 100%;
`;

const HeaderWrapper = styled.div`
  background-color: white;
  border-bottom: 1px solid rgb(93, 175, 116);
`;

const Header = styled.h1`
  align-items: center;
  background-color: white;
  border-bottom: 2px solid rgb(93, 175, 116);
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.8);
  display: flex;
  font-family: "Fjalla One", sans-serif;
  font-size: 48px;
  font-weight: 700;
  height: 90px;
  justify-content: center;
  line-height: 1.3;
  margin: 0;
  padding: 0;
  text-align: center;
`;

const CalendarHeader = styled.div`
  background-color: white;
  border-bottom: 2px solid rgb(93, 175, 116);
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.8);
  display: grid;
  font-family: "Work Sans", sans-serif;
  font-size: 18px;
  font-weight: 700;
  grid-template-columns: repeat(7, 1fr);
  height: 60px;
  line-height: 60px;
`;

const DayName = styled.div`
  align-items: center;
  border-right: 2px solid rgb(93, 175, 116);
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.8);
  display: flex;
  font-family: "Work Sans", sans-serif;
  font-size: 16px;
  font-weight: 700;
  height: 100%;
  justify-content: center;
  &:last-child {
    border-right: none;
  }
`;

const DayContainer = styled.div<{
  $isActive: boolean;
  $hasActivity: boolean;
  $isEmpty: boolean;
  $rowIndex: number;
  $colIndex: number;
  tabIndex: number;
}>`
  background-color: ${(props) =>
    props.$isActive ? "rgb(93, 175, 116)" : "white"};
  border-left: ${(props) =>
    props.$colIndex === 0 ? "none" : "1px solid rgb(93, 175, 116)"};
  border-right: ${(props) =>
    props.$colIndex === 6 ? "none" : "1px solid rgb(93, 175, 116)"};
  border-bottom: ${(props) =>
    props.$rowIndex === 5 ? "none" : "1px solid rgb(93, 175, 116)"};
  align-items: center;
  aspect-ratio: 1;
  border-top: 1px solid rgb(93, 175, 116);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding: 25px;
  text-align: center;
  transition: background-color 0.3s ease;
  width: 100%;
  &:hover,
  &:focus {
    background-color: ${(props) =>
      props.$isActive ? "rgb(93, 175, 116)" : "rgba(93, 175, 116, 0.1)"};
    outline: none;
  }
`;

const DayNumber = styled.div<{ $hasActivity: boolean; $isActive: boolean }>`
  font-size: 64px;
  font-family: "Libre Franklin", sans-serif;
  font-weight: 700;
  color: ${(props) =>
    props.$isActive
      ? "white"
      : props.$hasActivity
      ? "rgb(93, 175, 116)"
      : "rgba(0, 0, 0, 0.8)"};
  box-sizing: border-box;
  line-height: 1;
  margin: 0;
`;

const ActivityContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ActivityTitle = styled.div<{ $isActive: boolean }>`
  box-sizing: border-box;
  color: ${(props) => (props.$isActive ? "white" : "black")};
  font-family: "Libre Franklin", sans-serif;
  font-size: 10px;
  font-weight: 400;
  line-height: 1.2;
  overflow-wrap: break-word;
  text-align: center;
  text-transform: uppercase;
  white-space: normal;
  word-wrap: break-word;
`;

const CalendarBody = styled.div`
  box-sizing: border-box;
  display: grid;
  gap: 0px;
  grid-template-columns: repeat(7, 1fr);
  max-width: 100%;
  min-height: 450px;
`;
/**
 * Fills in the last row of the calendar with `null` values if it is incomplete.
 *
 * @param {Date[] | (Date | null)[]} days - The array of days to be filled.
 * @param {number} totalCells - The total number of cells required (e.g., 42 for 6 rows x 7 columns).
 * @returns {(Date | null)[]} - The updated array of days with `null` values added if necessary.
 */
const fillInLastRow = (
  days: (Date | null)[],
  totalCells: number
): (Date | null)[] => {
  const numDays = days.length;
  const fillCells = totalCells - numDays;

  const updatedDays = [...days];

  for (let i = 0; i < fillCells; i++) {
    updatedDays.push(null);
  }

  return updatedDays;
};
/**
 * Calendar component to display a calendar with activities.
 *
 * @param {Object} props - The component props.
 * @param {TreatmentProgram} [props.programData] - The treatment program data.
 * @returns {JSX.Element} The Calendar component.
 */
const Calendar: React.FC<{ programData?: TreatmentProgram }> = ({
  programData = treatmentData,
}) => {
  const today = useMemo(() => new Date(), []);
  const [adjustedActivities, setAdjustedActivities] = useState<
    { date: Date; title: string }[]
  >([]);
  const currentMonth = today;
  const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
  const end = endOfMonth(currentMonth);

  const days: (Date | null)[] = [];
  let day = start;
  while (isBefore(day, addDays(end, 1))) {
    days.push(day);
    day = addDays(day, 1);
  }

  const filledDays = fillInLastRow(days, 42);

  const getActivitiesForDate = (date: Date) =>
    adjustedActivities.filter((activity) => isSameDay(date, activity.date));

  const isDayInCurrentMonth = (date: Date | null) =>
    date ? isSameMonth(date, currentMonth) : false;

  useEffect(() => {
    if (!programData) return;

    const treatmentProgram = programData as TreatmentProgram;

    const allActivities: { date: Date; title: string }[] = [];
    const weeks = Object.keys(treatmentProgram);

    weeks.forEach((week) => {
      const weekNumber = parseInt(week.replace("week", ""), 10);
      const weekStartDate = addDays(
        startOfWeek(today, { weekStartsOn: 1 }),
        (weekNumber - 36) * 7
      );

      treatmentProgram[week].forEach((activity) => {
        const dayIndex = [
          "MONDAY",
          "TUESDAY",
          "WEDNESDAY",
          "THURSDAY",
          "FRIDAY",
          "SATURDAY",
          "SUNDAY",
        ].indexOf(activity.weekday.toUpperCase());
        const activityDate = addDays(weekStartDate, dayIndex);

        if (activity.completed) {
          allActivities.push({ date: activityDate, title: activity.title });
        } else if (isBefore(activityDate, today)) {
          allActivities.push({ date: today, title: activity.title });
        } else {
          allActivities.push({ date: activityDate, title: activity.title });
        }
      });
    });

    setAdjustedActivities(allActivities);
  }, [programData, today]);

  const gridRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    const focusableElements = gridRef.current?.querySelectorAll('[tabindex="0"]');
    if (!focusableElements || !gridRef.current) return;

    let newIndex: number | undefined;

    switch (event.key) {
      case "ArrowRight":
        newIndex = (index + 1) % focusableElements.length;
        break;
      case "ArrowLeft":
        newIndex = (index - 1 + focusableElements.length) % focusableElements.length;
        break;
      case "ArrowDown":
        newIndex = (index + 7) % focusableElements.length;
        break;
      case "ArrowUp":
        newIndex = (index - 7 + focusableElements.length) % focusableElements.length;
        break;
      default:
        break;
    }

    if (newIndex !== undefined) {
      const newCell = focusableElements[newIndex] as HTMLElement;
      newCell.focus();
      event.preventDefault();
    }
  };

  return (
    <CalendarContainer>
      <HeaderWrapper>
        <Header>Weekly Program</Header>
      </HeaderWrapper>
      <CalendarHeader>
        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
          <DayName key={day}>{day}</DayName>
        ))}
      </CalendarHeader>
      <CalendarBody role="grid" ref={gridRef}>
        {filledDays.map((date, index) => {
          const activities = date ? getActivitiesForDate(date) : [];
          const hasActivity = activities.length > 0;
          const isActive = date ? isToday(date) : false;
          const isEmpty = !date || !isDayInCurrentMonth(date);
          const rowIndex = Math.floor(index / 7);
          const colIndex = index % 7;

          return (
            <DayContainer
              role="gridcell"
              aria-label={date ? format(date, "EEEE, MMMM d") : ""}
              tabIndex={isEmpty ? -1 : 0}
              key={index}
              $isActive={isActive}
              $hasActivity={hasActivity}
              $isEmpty={isEmpty}
              $rowIndex={rowIndex}
              $colIndex={colIndex}
              onKeyDown={(event) => handleKeyDown(event, index)}
              aria-selected={isActive}
              data-testid={`day-${date ? format(date, "d") : "empty"}`}
            >
              <DayNumber $hasActivity={hasActivity} $isActive={isActive}>
                {isEmpty ? "" : format(date, "d")}
              </DayNumber>
              {!isEmpty && (
                <ActivityContainer>
                  {activities.map((activity, i) => (
                    <ActivityTitle key={i} $isActive={isActive}>
                      {activity.title}
                    </ActivityTitle>
                  ))}
                </ActivityContainer>
              )}
            </DayContainer>
          );
        })}
      </CalendarBody>
    </CalendarContainer>
  );
};

export default Calendar;
