import { Route, Routes } from 'react-router-dom';

import Calendar from "./components/Calendar";
import { CalendarProvider } from "./context/CalendarContext";
import Login from "./components/Login";
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import React from 'react';
import Register from "./components/Register";

const App: React.FC = () => {
  return (
    <CalendarProvider>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <Calendar programData={{ /* provide valid ApiCreateActivityPost201Response object here */ }} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </CalendarProvider>
  );
};

export default App;