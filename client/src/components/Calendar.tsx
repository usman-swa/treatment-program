import {
  ADD_ACTIVITY,
  SET_ACTIVITIES,
  useCalendar,
} from "../context/CalendarContext";
import { ApiCreateActivityPost201Response, DefaultApi } from "../api";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Modal as MuiModal,
  TextField,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import {
  addDays,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import LanguageSwitcher from "./LanguageSwitcher";
import { TreatmentProgram } from "../types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

// Define interfaces and styled components as before

const AddActivityButton = styled.button`
  background-color: rgb(93, 175, 116);
  border: none;
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

const Header = styled.h1`
  background-color: white;
  color: rgba(0, 0, 0, 0.8);
  font-family: "Fjalla One", sans-serif;
  font-size: 48px;
  font-weight: 700;
  margin: 0;
  padding: 20px 0;
  text-align: center;
  margin-left: 108px;
  flex: 1;
`;

const CalendarHeader = styled.div`
  background-color: white;
  border-bottom: 2px solid rgb(93, 175, 116);
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
  line-height: 1;
  margin: 0;
`;

const ActivityContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ActivityTitle = styled.div<{ $isActive: boolean }>`
  color: ${(props) => (props.$isActive ? "white" : "black")};
  font-family: "Libre Franklin", sans-serif;
  font-size: 10px;
  font-weight: 400;
  line-height: 1.2;
  text-align: center;
  text-transform: uppercase;
`;

const CalendarBody = styled.div`
  display: grid;
  gap: 0px;
  grid-template-columns: repeat(7, 1fr);
  max-width: 100%;
  min-height: 450px;
`;

// Modal styling
const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

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
  const [newActivity, setNewActivity] = useState({
    week: "",
    weekday: "",
    title: "",
    completed: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const currentMonth = today;
  const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
  const end = endOfMonth(currentMonth);

  const days: (Date | null)[] = [];
  let day = start;
  while (day <= end) {
    days.push(day);
    day = addDays(day, 1);
  }

  const filledDays = days.filter(
    (date): date is Date => date !== null && isSameMonth(date, currentMonth)
  );

  const getActivitiesForDate = (date: Date) =>
    state.activities.filter((activity) => isSameDay(date, activity.date)); // Access activities from global state

  useEffect(() => {
    if (!programData) return;

    const treatmentProgram = programData as TreatmentProgram;
    const allActivities: { date: Date; title: string }[] = [];

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
          ].indexOf((activity.weekday ?? "").toUpperCase());

          const activityDate = addDays(weekStartDate, dayIndex);

          if (activity.completed) {
            allActivities.push({
              date: activityDate,
              title: activity.title ?? "Untitled Activity",
            });
          } else if (isBefore(activityDate, today)) {
            allActivities.push({
              date: today,
              title: activity.title + " (overdue)",
            });
          } else if (isAfter(activityDate, today)) {
            // Handle future activities
            allActivities.push({
              date: activityDate,
              title: activity.title + " (future)",
            });
          }
        }
      );
    });

    dispatch({ type: SET_ACTIVITIES, payload: allActivities }); // Update global state
  }, [programData, today, dispatch]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewActivity({ ...newActivity, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!newActivity.week || !newActivity.weekday || !newActivity.title) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      setLoading(true);

      const api = new DefaultApi();
      const response = await api.apiCreateActivityPost({
        week: newActivity.week,
        weekday: newActivity.weekday,
        title: newActivity.title,
        completed: newActivity.completed,
      });

      if (response.status === 201) {
        const baseDate = new Date(2024, 8, 2);
        const weekNumber = parseInt(newActivity.week.replace("week", ""), 10);
        const weekStartDate = addDays(baseDate, (weekNumber - 36) * 7);
        const dayIndex = [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ].indexOf(newActivity.weekday.toLowerCase());
        const activityDate = addDays(weekStartDate, dayIndex);

        const addedActivity = {
          date: activityDate,
          title: newActivity.title,
        };

        // Dispatch action to add the new activity to global state
        dispatch({ type: ADD_ACTIVITY, payload: addedActivity });

        setSuccessMessage("Activity added successfully.");
        closeModal();
      } else {
        throw new Error("Failed to add activity.");
      }
    } catch (error) {
      setError("Error adding activity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Remaining code is the same */}
      <CalendarContainer>
        <HeaderWrapper>
          <Header>{t("CalendarTitle")}</Header>
          <LanguageSwitcher />
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

      {/* Modal for adding new activity */}
      <MuiModal open={isModalOpen} onClose={closeModal}>
        <Box component="form" sx={modalStyle} onSubmit={handleSubmit}>
          <h2>Add New Activity</h2>

          <TextField
            name="week"
            label="Week"
            select
            value={newActivity.week}
            onChange={handleFormChange}
            required
          >
            <MenuItem value="week36">Week 36</MenuItem>
            <MenuItem value="week37">Week 37</MenuItem>
            <MenuItem value="week38">Week 38</MenuItem>
            <MenuItem value="week39">Week 39</MenuItem>
            {/* Add more week options here */}
          </TextField>

          <TextField
            name="weekday"
            label="Weekday"
            select
            value={newActivity.weekday}
            onChange={handleFormChange}
            required
          >
            <MenuItem value="monday">Monday</MenuItem>
            <MenuItem value="tuesday">Tuesday</MenuItem>
            <MenuItem value="wednesday">Wednesday</MenuItem>
            {/* Add more weekday options here */}
          </TextField>

          <TextField
            name="title"
            label="Title"
            value={newActivity.title}
            onChange={handleFormChange}
            required
          />

          {loading ? (
            <CircularProgress />
          ) : (
            <Button type="submit" variant="contained" color="primary">
              Add Activity
            </Button>
          )}
          {error && <div style={{ color: "red" }}>{error}</div>}
          {successMessage && (
            <div style={{ color: "green" }}>{successMessage}</div>
          )}
        </Box>
      </MuiModal>
    </>
  );
};

export default Calendar;
