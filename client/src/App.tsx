import React, { useEffect, useState } from "react";

import Calendar from "./components/Calendar";
import { TreatmentProgram } from "./types";

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
