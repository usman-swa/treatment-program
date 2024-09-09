import { Box, Button, Checkbox, FormControlLabel, Modal, TextField, Typography } from "@mui/material";
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

import styled from "@emotion/styled";

// Define interfaces and styled components as before

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
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Header = styled(Typography)`
  font-family: "Fjalla One", sans-serif;
  font-size: 48px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.8);
  margin: 0;
  padding: 0;
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

const Calendar: React.FC<{ programData: TreatmentProgram }> = ({ programData }) => {
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

  // Generate the array of days (but filter out days that are not in the current month)
  const days: (Date | null)[] = [];
  let day = start;
  while (day <= end) {
    days.push(day);
    day = addDays(day, 1);
  }

  const filledDays = days.filter((date): date is Date => date !== null && isSameMonth(date, currentMonth));

  const getActivitiesForDate = (date: Date) =>
    adjustedActivities.filter((activity) => isSameDay(date, activity.date));

  useEffect(() => {
    if (!programData) return;

    const treatmentProgram = programData as TreatmentProgram;
    const allActivities: { date: Date; title: string }[] = [];

    const baseDate = new Date(2024, 8, 2); // Define the base date

    Object.keys(treatmentProgram).forEach((week) => {
      const weekNumber = parseInt(week.replace("week", ""), 10);
      const weekStartDate = addDays(baseDate, (weekNumber - 36) * 7);

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
          // Move incomplete activities to today if they are overdue
          allActivities.push({
            date: today,
            title: `${activity.title} (Missed)`,
          });
        } else if (isAfter(activityDate, today)) {
          // Add future activities
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
    try {
      const response = await fetch("http://localhost:4000/api/create-activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newActivity),
      });
      const result = await response.json();
      if (response.ok) {
        // Handle success
        console.log("Activity added:", result);
        // Update programData or other state if needed
      } else {
        // Handle error
        console.error("Error adding activity:", result.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <CalendarContainer>
      <HeaderWrapper>
        <Header>Calendar</Header>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddActivityClick}
        >
          Add Activity
        </Button>
      </HeaderWrapper>
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #ccc',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Add New Activity
          </Typography>
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
            <FormControlLabel
              control={
                <Checkbox
                  name="completed"
                  checked={newActivity.completed}
                  onChange={(e) =>
                    setNewActivity((prev) => ({
                      ...prev,
                      completed: e.target.checked,
                    }))
                  }
                />
              }
              label="Completed"
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Add Activity
            </Button>
          </form>
        </Box>
      </Modal>

      <CalendarBody>
        {filledDays.map((date, idx) => {
          const isActive = isToday(date || new Date());
          const activities = date ? getActivitiesForDate(date) : [];
          const hasActivity = activities.length > 0;

          return (
            <DayContainer
              key={idx}
              $isActive={isActive}
              $hasActivity={hasActivity}
              $isEmpty={false} // Since we're only rendering valid days
              $rowIndex={Math.floor(idx / 7)}
              $colIndex={idx % 7}
              tabIndex={0}
            >
              {date && (
                <>
                  <DayNumber $hasActivity={hasActivity} $isActive={isActive}>
                    {format(date, "d")}
                  </DayNumber>
                  {activities.length > 0 && (
                    <ActivityContainer>
                      {activities.map((activity, activityIdx) => (
                        <ActivityTitle key={activityIdx} $isActive={isActive}>
                          {activity.title}
                        </ActivityTitle>
                      ))}
                    </ActivityContainer>
                  )}
                </>
              )}
            </DayContainer>
          );
        })}
      </CalendarBody>
    </CalendarContainer>
  );
};

const App: React.FC = () => {
  const [programData, setProgramData] = useState<TreatmentProgram | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) return;

    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/treatment-program");
        const data: TreatmentProgram = await response.json();
        setProgramData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!programData) {
    return <div>No Data Available</div>; // Optionally handle the case when no data is available
  }

  return (
    <div>
      <Calendar programData={programData} />
    </div>
  );
};

export default App;
