import { ApiTreatmentProgramGet200ResponseValueInner, DefaultApi } from "./api"; // Adjust the import path as needed
import React, { useEffect, useState } from "react";

import Calendar from "./components/Calendar";
import { TreatmentProgram } from "./types";

// Define an interface that matches your API response structure
interface ApiResponse {
  [week: string]: ApiTreatmentProgramGet200ResponseValueInner[];
}

const App: React.FC = () => {
  const [programData, setProgramData] = useState<TreatmentProgram | null>(null);
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
          treatmentProgram[week] = activities.map(activity => ({
            weekday: activity.weekday || "",
            title: activity.title || "",
            completed: activity.completed || false
          }));
        }

        setProgramData(treatmentProgram);
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
