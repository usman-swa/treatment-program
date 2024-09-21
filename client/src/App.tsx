import {
  ApiCreateActivityPost201Response,
  ApiTreatmentProgramGet200ResponseValueInner,
  DefaultApi,
} from "./api";
import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Calendar from "./components/Calendar";
import { CalendarProvider } from "./context/CalendarContext";
import Login from "./components/Login"; // Import the Login component
import { TreatmentProgram } from "./types";

// Adjust the import path as needed








// Define an interface that matches your API response structure
interface ApiResponse {
  [week: string]: ApiTreatmentProgramGet200ResponseValueInner[];
}

const App: React.FC = () => {
  const [programData, setProgramData] =
    useState<ApiCreateActivityPost201Response | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) return;

    const fetchData = async () => {
      try {
        // Create an instance of the generated API client
        const apiClient = new DefaultApi();
        // Call the API method to get the treatment program data
        const response = await apiClient.apiTreatmentProgramGet();
        const apiData: ApiResponse = response.data;

        // Map API response to TreatmentProgram type
        const treatmentProgram: TreatmentProgram = {};
        for (const [week, activities] of Object.entries(apiData)) {
          treatmentProgram[week] = activities.map((activity) => ({
            weekday: activity.weekday || "",
            title: activity.title || "",
            completed: activity.completed || false,
          }));
        }

        setProgramData(treatmentProgram);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isLoading]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/calendar" element={
          <CalendarProvider>
            <Calendar programData={programData || {}} />
          </CalendarProvider>
        } />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;