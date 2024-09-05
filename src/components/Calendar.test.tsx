import "@testing-library/jest-dom/extend-expect";

import { addDays, format } from "date-fns";
import { render, screen } from "@testing-library/react";

import Calendar from "./Calendar"; // Adjust the import as necessary
import React from "react";

// Helper function to get incomplete activities from mockData
const getIncompleteActivities = (data: Record<string, { weekday: string; title: string; completed: boolean }[]>) => {
  const incompleteActivities: string[] = [];

  Object.values(data).forEach((week) => {
    week.forEach((activity) => {
      if (!activity.completed) {
        incompleteActivities.push(activity.title);
      }
    });
  });

  return incompleteActivities;
};

const mockData = {
  week36: [
    { weekday: "MONDAY", title: "The Meru Health Program", completed: false },
    { weekday: "WEDNESDAY", title: "Introduction to the Program", completed: true }, // Today
    { weekday: "FRIDAY", title: "The Science Behind Mindfulness", completed: true },
  ],
  week37: [
    { weekday: "MONDAY", title: "Mind on Autopilot", completed: false }, // Incomplete
    { weekday: "WEDNESDAY", title: "Mindful Presence", completed: false }, // Incomplete
    { weekday: "FRIDAY", title: "Consequences of Autopilot", completed: false },
  ],
  week38: [
    { weekday: "MONDAY", title: "The Negativity Spiral", completed: false }, // Incomplete
    { weekday: "WEDNESDAY", title: "Spiral of Negative Interpretations", completed: false }, // Incomplete
    { weekday: "FRIDAY", title: "Interrupting the Negativity Spiral", completed: false },
  ],
};

describe("Calendar Component", () => {
  it("should display the current month and highlight today's date", () => {
    const today = new Date(); // Ensure today's date is a Wednesday
    const todayFormatted = format(today, "d");

    render(<Calendar programData={mockData} />);

    const todayCell = screen.getByTestId(`day-${todayFormatted}`);

    // Check if today's cell is highlighted
    expect(todayCell).toHaveStyle("background-color: rgb(93, 175, 116)");
  });
});

describe("Calendar Component with Activities", () => {
  it("should display activities under the day number and highlight day numbers with activities differently", () => {
    const today = new Date();

    render(<Calendar programData={mockData} />);

    // Extract incomplete activities from mockData
    const incompleteActivities = getIncompleteActivities(mockData);

    // Add today's specific activity
    const todayActivity = "Introduction to the Program";

    // Check if today's date cell is displayed correctly

    // Ensure today's cell displays the specific activity for today
    expect(screen.getByText(todayActivity)).toBeInTheDocument();

    // Ensure all incomplete activities are displayed in today's cell
    incompleteActivities.forEach((activity) => {
      expect(screen.getByText(activity)).toBeInTheDocument();
    });

    // Check past days to ensure incomplete activities are not present
    const pastDays = [
      format(addDays(today, -1), "d"),
      format(addDays(today, -2), "d"),
    ];

    pastDays.forEach((day) => {
      const dayCell = screen.getByTestId(`day-${day}`);
      expect(dayCell).toBeInTheDocument();

      // Ensure incomplete activities are not present on past days
      incompleteActivities.forEach((activity) => {
        // Check that incomplete activities do not appear on past days
        const activityText = screen.queryByText(activity);
        if (activityText) {
          // Ensure the activity is not in past day cells
          const dayCell = screen.getByTestId(`day-${day}`);
          expect(dayCell.contains(activityText)).toBe(false);
        }
      });
    });

    // Ensure only one activity per day
    const allDaysCells = screen.getAllByRole("gridcell");
    allDaysCells.forEach((cell) => {
      const activities = cell.querySelectorAll("[data-testid='activity']");
      expect(activities.length).toBeLessThanOrEqual(1);
    });
  });
});
