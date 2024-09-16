import { ActivityContainer, ActivityTitle, DayContainer, DayNumber } from "../styles/calendarStyles";
import { format, isSameDay, isToday } from "date-fns";

import React from "react";
import { useCalendar } from "../context/CalendarContext";

const Day: React.FC<{ date: Date; index: number; today: Date }> = ({ date, index, today }) => {
  const { state } = useCalendar();
  const isActive = isToday(date);
  const activities = state.activities.filter((activity) => isSameDay(date, activity.date));
  const hasActivity = activities.length > 0;

  return (
    <DayContainer
      $isActive={isActive}
      $hasActivity={hasActivity}
      $isEmpty={!hasActivity}
      $rowIndex={Math.floor(index / 7)}
      $colIndex={index % 7}
      tabIndex={0}
    >
      <DayNumber $isActive={isActive} $hasActivity={hasActivity}>
        {format(date, "d")}
      </DayNumber>

      {hasActivity && (
        <ActivityContainer>
          {activities.map((activity, activityIndex) => (
            <ActivityTitle key={activityIndex} $isActive={isActive}>
              {activity.title}
            </ActivityTitle>
          ))}
        </ActivityContainer>
      )}
    </DayContainer>
  );
};

export default Day;
