import React, { createContext, useContext, useReducer } from "react";

import { ReactNode } from "react";

// Define action types
export const ADD_ACTIVITY = "ADD_ACTIVITY";
export const SET_ACTIVITIES = "SET_ACTIVITIES";

// Extend ApiCreateActivityPostRequest to include a 'date' field
export interface Activity {
  date: Date;
  id?: number;
  week?: string;
  weekday?: string;
  title?: string;
  completed?: boolean;
}

// Define initial state
const initialState: State = {
  activities: [],
};

// Define context type
interface CalendarContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
}

// Create context with default value
const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

// Define reducer state
interface State {
  activities: Activity[]; // State stores an array of Activity
}

// Define actions
interface AddActivityAction {
  type: typeof ADD_ACTIVITY;
  payload: Activity; // Payload now includes Activity
}

interface SetActivitiesAction {
  type: typeof SET_ACTIVITIES;
  payload: Activity[]; // Updated to use Activity[]
}

type Action = AddActivityAction | SetActivitiesAction;

// Reducer using spread operator
/**
 * Reducer function for managing calendar state.
 *
 * @param state - The current state of the calendar.
 * @param action - The action to be processed.
 * @returns The new state of the calendar.
 *
 * @remarks
 * This reducer handles two types of actions:
 * - `ADD_ACTIVITY`: Adds a new activity to the list of activities.
 * - `SET_ACTIVITIES`: Sets the list of activities to the provided payload.
 *
 * @example
 * // Example action for adding an activity
 * const addAction = { type: ADD_ACTIVITY, payload: newActivity };
 * const newState = calendarReducer(currentState, addAction);
 *
 * @example
 * // Example action for setting activities
 * const setActivitiesAction = { type: SET_ACTIVITIES, payload: activitiesArray };
 * const newState = calendarReducer(currentState, setActivitiesAction);
 */
const calendarReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ADD_ACTIVITY:
      return {
        ...state,
        activities: [...state.activities, action.payload], // Add new activity using spread operator
      };
    case SET_ACTIVITIES:
      return {
        ...state,
        activities: [...action.payload], // Set activities using spread operator
      };
    default:
      return state;
  }
};

// Define provider props
interface CalendarProviderProps {
  children: ReactNode;
}

// CalendarProvider component
export const CalendarProvider = ({ children }: CalendarProviderProps) => {
  const [state, dispatch] = useReducer(calendarReducer, initialState);

  return (
    <CalendarContext.Provider value={{ state, dispatch }}>
      {children}
    </CalendarContext.Provider>
  );
};

// Custom hook to use the CalendarContext
export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
};
