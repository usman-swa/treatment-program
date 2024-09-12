import React, { createContext, useContext, useReducer } from "react";

import { ReactNode } from "react";

// Context provider component

// Define action types
export const ADD_ACTIVITY = "ADD_ACTIVITY";
export const SET_ACTIVITIES = "SET_ACTIVITIES";

// Define initial state
const initialState = {
  activities: [],
};

// Define context type
interface CalendarContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
}

// Create context with default value
const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

// Define reducer
interface State {
  activities: any[];
}

interface Action {
  type: string;
  payload?: any;
}

const calendarReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ADD_ACTIVITY:
      return {
        ...state,
        activities: [...state.activities, action.payload],
      };
    case SET_ACTIVITIES:
      return {
        ...state,
        activities: action.payload,
      };
    default:
      return state;
  }
};

interface CalendarProviderProps {
  children: ReactNode;
}

export const CalendarProvider = ({ children }: CalendarProviderProps) => {
  const [state, dispatch] = useReducer(calendarReducer, initialState);

  console.log("Current state:", state); // Log state here

  return (
    <CalendarContext.Provider value={{ state, dispatch }}>
      {children}
    </CalendarContext.Provider>
  );
};

// Custom hook to use the CalendarContext
export const useCalendar = () => useContext(CalendarContext);
