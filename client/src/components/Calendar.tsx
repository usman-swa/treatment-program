import { Button, Modal as MuiModal, TextField } from "@mui/material";
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

import { DefaultApi } from "../api";
import styled from "styled-components";

// Define interfaces and styled components as before

interface Activity {
  weekday: string;
  title: string;
  completed: boolean;
}

interface TreatmentProgram {
  [week: string]: Activity[];
}

const AddActivityButton = styled.button`
  background-color: rgb(93, 175, 116);
  border: none;
  color: white;
  font-size: 16px;
  padding: 10px 20px;
  cursor: pointer;
`;

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
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
  justify-content: center; /* Center content horizontally */
  align-items: center; /* Center content vertically */
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
  flex: 1; /* Take up remaining space */
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

const Calendar: React.FC<{ programData: TreatmentProgram }> = ({
  programData,
}) => {
  const today = useMemo(() => new Date(), []);
  const [adjustedActivities, setAdjustedActivities] = useState<
    { date: Date; title: string }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newActivity, setNewActivity] = useState({
    week: "",
    weekday: "",
    title: "",
    completed: false,
  });

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
    adjustedActivities.filter((activity) => isSameDay(date, activity.date));

  useEffect(() => {
    if (!programData) return;

    const treatmentProgram = programData as TreatmentProgram;
    const allActivities: { date: Date; title: string }[] = [];

    const baseDate = new Date(2024, 8, 1); // Adjust base date if needed

    Object.keys(treatmentProgram).forEach((week) => {
      const weekNumber = parseInt(week.replace("week", ""), 10);
      const weekStartDate = addDays(baseDate, (weekNumber - 36) * 7);

      (treatmentProgram[week] as Activity[]).forEach((activity) => {
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
        console.log("Computed Activity Date:", activityDate); // Debugging

        if (activity.completed) {
          allActivities.push({ date: activityDate, title: activity.title });
        } else if (isBefore(activityDate, today)) {
          allActivities.push({
            date: today,
            title: `${activity.title} (Missed)`,
          });
        } else if (isAfter(activityDate, today)) {
          allActivities.push({ date: activityDate, title: activity.title });
        }
      });
    });

    setAdjustedActivities(allActivities);
  }, [programData, today]);

  const handleAddActivityClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewActivity((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
    console.log("New Activity:", newActivity);

    try {
      // Use the generated API client to create the activity
      const apiClient = new DefaultApi();
      const response = await apiClient.apiCreateActivityPost(newActivity);

      if (response.status === 200) {
        // Handle successful response
        console.log("Activity added successfully");
        // Optionally, you could update local state or refetch data here
        handleCloseModal();
      } else {
        throw new Error("Failed to add activity");
      }
    } catch (error) {
      console.error("Error adding activity:", error);
    }
  };

  return (
    <CalendarContainer>
      <HeaderWrapper>
        <Header>Calendar</Header>
        <AddActivityButton onClick={handleAddActivityClick}>
          Add Activity
        </AddActivityButton>
      </HeaderWrapper>
      <CalendarHeader>
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <DayName key={day}>{day}</DayName>
        ))}
      </CalendarHeader>
      <CalendarBody>
        {filledDays.map((date, index) => (
          <DayContainer
            key={index}
            $isActive={isToday(date)}
            $hasActivity={getActivitiesForDate(date).length > 0}
            $isEmpty={getActivitiesForDate(date).length === 0}
            $rowIndex={Math.floor(index / 7)}
            $colIndex={index % 7}
            tabIndex={0}
          >
            <DayNumber
              $hasActivity={getActivitiesForDate(date).length > 0}
              $isActive={isToday(date)}
            >
              {format(date, "d")}
            </DayNumber>
            <ActivityContainer>
              {getActivitiesForDate(date).map((activity, idx) => (
                <ActivityTitle key={idx} $isActive={isToday(date)}>
                  {activity.title}
                </ActivityTitle>
              ))}
            </ActivityContainer>
          </DayContainer>
        ))}
      </CalendarBody>

      {/* Modal for Adding Activities */}
      <ModalOverlay isOpen={isModalOpen}>
        <MuiModal
          open={isModalOpen}
          onClose={handleCloseModal}
          aria-labelledby="add-activity-modal"
          aria-describedby="modal-to-add-new-activities"
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              margin: "auto",
              maxWidth: "500px",
            }}
          >
            <h2 id="add-activity-modal">Add New Activity</h2>
            <form onSubmit={handleFormSubmit}>
              <TextField
                label="Week"
                name="week"
                value={newActivity.week}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Weekday"
                name="weekday"
                value={newActivity.weekday}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Title"
                name="title"
                value={newActivity.title}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <Button
                type="submit"
                color="success"
                variant="outlined"
                fullWidth
              >
                Add Activity
              </Button>
            </form>
          </div>
        </MuiModal>
      </ModalOverlay>
    </CalendarContainer>
  );
};

export default Calendar;
