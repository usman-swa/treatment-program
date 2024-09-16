import { ADD_ACTIVITY, useCalendar } from "../context/CalendarContext";
import { Box, Button, CircularProgress, Modal as MuiModal, TextField } from "@mui/material";
import React, { useState } from "react";

import { DefaultApi } from "../api"
import { modalStyle } from "../styles/calendarStyles";

const AddActivityModal: React.FC<{
  isModalOpen: boolean;
  closeModal: () => void;
}> = ({ isModalOpen, closeModal }) => {
  const calendarContext = useCalendar();
  if (!calendarContext) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  const { dispatch } = calendarContext;

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
        dispatch({
          type: ADD_ACTIVITY,
          payload: {
            date: new Date(), // Simplified, calculate date properly
            title: newActivity.title,
          },
        });
        setSuccessMessage("Activity added successfully.");
        closeModal();
      }
    } catch (error) {
      setError("Error adding activity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
          {/* Week options */}
        </TextField>

        <TextField
          name="weekday"
          label="Weekday"
          select
          value={newActivity.weekday}
          onChange={handleFormChange}
          required
        >
          {/* Weekday options */}
        </TextField>

        <TextField
          name="title"
          label="Title"
          value={newActivity.title}
          onChange={handleFormChange}
          required
        />

        {loading ? <CircularProgress /> : <Button type="submit">Add Activity</Button>}
        {error && <div style={{ color: "red" }}>{error}</div>}
        {successMessage && <div style={{ color: "green" }}>{successMessage}</div>}
      </Box>
    </MuiModal>
  );
};

export default AddActivityModal;
