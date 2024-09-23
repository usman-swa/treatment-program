import { ApiCreateActivityPost201Response, ApiTreatmentProgramGet200ResponseValueInner, DefaultApi } from './api';
import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import Calendar from "./components/Calendar";
import { CalendarProvider } from "./context/CalendarContext";
import Login from "./components/Login"; // Import the Login component
import Register from "./components/Register";
import { TreatmentProgram } from "./types";
import axios from 'axios';

// Define an interface that matches your API response structure
interface ApiResponse {
  [week: string]: ApiTreatmentProgramGet200ResponseValueInner[];
}

const App: React.FC = () => {
  const [programData, setProgramData] = useState<ApiCreateActivityPost201Response | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) return;

    const fetchData = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error("No token found");
        }

        console.log('Token:', token); // Log the token to verify

        // Create an Axios instance with the token
        const axiosInstance = axios.create({
          baseURL: 'http://localhost:8000',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Create an instance of the generated API client with the Axios instance
        const apiClient = new DefaultApi(undefined, '', axiosInstance);

        // Call the API method to get the treatment program data
        let apiData: ApiResponse = {};
        try {
          const response = await apiClient.apiTreatmentProgramGet(); // Replace with your actual API endpoint
          console.log('Response:', response);
          apiData = response.data;
        } catch (error) {
          console.error('Error:', error);
        }

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
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [isLoading]);

  return (
    <CalendarProvider>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/calendar" element={programData ? <Calendar programData={programData} /> : <div>Loading...</div>} />
        </Routes>
      </div>
    </CalendarProvider>
  );
};

export default App;