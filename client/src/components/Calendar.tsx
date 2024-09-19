import { ActivityContainer, ActivityTitle, CalendarBody, DayContainer, DayNumber } from "../components/CalendarBody";
import { CalendarHeader, DayName, Header } from "../components/CalendarHeader";
import React, { useMemo, useState } from "react";
import { format, isSameDay, isToday } from "date-fns";

import AddActivityModal from "../components/AddActivityModal";
import { ApiCreateActivityPost201Response } from "../api";
import LanguageSwitcher from "./LanguageSwitcher";
import { getCalendarDays } from "../utils/dateUtils";
import styled from "styled-components";
import { useCalendar } from "../context/CalendarContext";
import useCalendarData from "../hooks/useCalendarData";
import { useTranslation } from "react-i18next";

const AddActivityButton = styled.button`
  background-color: rgb(93, 175, 116);
  border: none;
  border-radius: 24px;
  color: white;
  font-size: 16px;
  padding: 10px 20px;
  cursor: pointer;
`;

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
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
`;

/**
 * Calendar component that displays a calendar view with activities.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {ApiCreateActivityPost201Response} props.programData - Data for the program activities
 * 
 * @returns {JSX.Element} The rendered Calendar component
 * 
 * @throws {Error} If `useCalendar` is not used within a `CalendarProvider`
 * 
 * @example
 * <Calendar programData={programData} />
 * 
 * @remarks
 * This component uses the `useCalendar` hook to access the calendar context,
 * and the `useTranslation` hook for internationalization. It also uses the
 * `useCalendarData` hook to fetch and dispatch calendar data.
 * 
 * The calendar displays days of the current month and highlights the current day.
 * Activities for each day are fetched from the global state and displayed within
 * the corresponding day cell. An "Add Activity" button opens a modal to add new activities.
 */
const Calendar: React.FC<{ programData: ApiCreateActivityPost201Response }> = ({
  programData,
}) => {
  const { t } = useTranslation();
  const today = useMemo(() => new Date(), []);

  const calendarContext = useCalendar(); // Access context
  if (!calendarContext) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  const { state, dispatch } = calendarContext; // Destructure state and dispatch from context
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentMonth = today;
  const filledDays = getCalendarDays(currentMonth);

  const getActivitiesForDate = (date: Date) =>
    state.activities.filter((activity) => isSameDay(date, activity.date)); // Access activities from global state

  useCalendarData(programData, today, dispatch);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <CalendarContainer>
        <HeaderWrapper>
          <LanguageSwitcher />
          <Header>{t("CalendarTitle")}</Header>
          <AddActivityButton onClick={openModal}>
            Add Activity
          </AddActivityButton>
        </HeaderWrapper>

        <CalendarHeader>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <DayName key={day}>{day}</DayName>
          ))}
        </CalendarHeader>

        <CalendarBody>
          {filledDays.map((date, index) => {
            const dayNumber = format(date, "d");
            const isActive = isToday(date);
            const activities = getActivitiesForDate(date);
            const hasActivity = activities.length > 0;

            return (
              <DayContainer
                key={date.toISOString()}
                $isActive={isActive}
                $hasActivity={hasActivity}
                $isEmpty={!hasActivity}
                $rowIndex={Math.floor(index / 7)}
                $colIndex={index % 7}
                tabIndex={0}
              >
                <DayNumber $isActive={isActive} $hasActivity={hasActivity}>
                  {dayNumber}
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
          })}
        </CalendarBody>
      </CalendarContainer>

      <AddActivityModal isOpen={isModalOpen} onClose={closeModal} dispatch={dispatch} />
    </>
  );
};

export default Calendar;