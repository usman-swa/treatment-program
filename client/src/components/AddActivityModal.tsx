import { Box, Button, CircularProgress, MenuItem, Modal as MuiModal, TextField } from "@mui/material";
import React, { useState } from "react";

import { ADD_ACTIVITY } from "../context/CalendarContext";
import { DefaultApi } from "../api";
import { addDays } from "date-fns";
import { modalStyle } from "../styles/modalStyle";

/**
 * AddActivityModal component allows users to add a new activity.
 * 
 * @component
 * @param {Object} props - The properties object.
 * @param {boolean} props.isOpen - Determines if the modal is open.
 * @param {() => void} props.onClose - Function to close the modal.
 * @param {any} props.dispatch - Dispatch function to update global state.
 * 
 * @returns {JSX.Element} The rendered AddActivityModal component.
 * 
 * @example
 * <AddActivityModal isOpen={isOpen} onClose={handleClose} dispatch={dispatch} />
 * 
 * @remarks
 * This component uses Material-UI components for the modal and form elements.
 * It handles form state and submission, including validation and API interaction.
 * 
 * @internal
 * The component maintains local state for the new activity, loading status, error messages, and success messages.
 * It dispatches an action to add the new activity to the global state upon successful submission.
 */
const AddActivityModal: React.FC<{ isOpen: boolean; onClose: () => void; dispatch: any }> = ({
  isOpen,
  onClose,
  dispatch,
}) => {
  const [newActivity, setNewActivity] = useState({
    week: "",
    weekday: "",
    title: "",
    completed: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
        onClose();
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
    <MuiModal open={isOpen} onClose={onClose}>
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
          <Button type="submit" variant="contained" sx={{ backgroundColor: "rgb(93, 175, 116)" }}>
            Add Activity
          </Button>
        )}
        {error && <div style={{ color: "red" }}>{error}</div>}
        {successMessage && (
          <div style={{ color: "green" }}>{successMessage}</div>
        )}
      </Box>
    </MuiModal>
  );
};

export default AddActivityModal;