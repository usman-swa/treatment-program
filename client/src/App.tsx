import { ApiTreatmentProgramGet200ResponseValueInner, Configuration, DefaultApi } from "./api";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import Calendar from "./components/Calendar";
import { CalendarProvider } from "./context/CalendarContext";
import Login from "./components/Login";
import Profile from "./components/Profile"; // Import Profile component
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./components/Register";
import { TreatmentProgram } from "./types";
import axios from "axios";

const App: React.FC = () => {
  const [programData, setProgramData] = useState<TreatmentProgram | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) return;
    const fetchData = async (navigate: ReturnType<typeof useNavigate>) => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem("token");
        // Access the BASE_PATH environment variable
        const basePath = "http://localhost:8000";
        // Create an instance of the generated API client with the token
        const config = new Configuration({ basePath });
        const apiClient = new DefaultApi(config);
        // Add an interceptor to include the Authorization header
        axios.interceptors.request.use(
          (config) => {
            config.headers.Authorization = `Bearer ${token}`;
            return config;
          },
          (error) => {
            return Promise.reject(error);
          }
        );
        // Call the API method to get the treatment program data
        let apiData: ApiTreatmentProgramGet200ResponseValueInner = {};
        try {
          const response = await apiClient.apiTreatmentProgramGet();
          apiData = response.data;
        } catch (error) {
          if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
            // Token has expired or is invalid
            localStorage.removeItem('token');
            navigate('/login');
          }
        }
        // Map API response to TreatmentProgram type
        const treatmentProgram: TreatmentProgram = {};
        for (const [week, activities] of Object.entries(apiData)) {
          treatmentProgram[week] = activities.map((activity: any) => ({
            weekday: activity.weekday ?? "",
            title: activity.title ?? "",
            completed: activity.completed ?? false,
          }));
        }
        setProgramData(treatmentProgram);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData(navigate);
  }, [isLoading, navigate]);

  return (
    <CalendarProvider>
      <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/calendar" />} /> {/* Redirect root to /calendar */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} /> {/* Remove email parameter */}
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  {programData ? (
                    <Calendar programData={programData} />
                  ) : (
                    <div>Loading...</div>
                  )}
                </ProtectedRoute>
              }
            />
          </Routes>
      </div>
    </CalendarProvider>
  );
};

export default App;