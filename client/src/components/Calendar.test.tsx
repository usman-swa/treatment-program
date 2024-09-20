import { fireEvent, render, screen } from "@testing-library/react";

import Calendar from "./Calendar";
import { CalendarProvider } from "../context/CalendarContext";
import React from "react";
import { mockProgramData } from "../mocks/programData";

// Mock the hooks and components used in Calendar
jest.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock("../context/CalendarContext", () => ({
    useCalendar: jest.fn(),
    CalendarProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("../hooks/useCalendarData", () => jest.fn());
jest.mock("../components/AddActivityModal", () => ({ isOpen, onClose, dispatch }: any) => (
    isOpen ? <div data-testid="add-activity-modal">Modal Content</div> : null
));
jest.mock("./LanguageSwitcher", () => () => <div>LanguageSwitcher</div>);

const mockUseCalendar = require("../context/CalendarContext").useCalendar;

describe("Calendar Component", () => {
    

    const mockState = {
        activities: [
            { date: new Date(), title: "Test Activity" },
        ],
    };

    const mockDispatch = jest.fn();

    beforeEach(() => {
        mockUseCalendar.mockReturnValue({
            state: mockState,
            dispatch: mockDispatch,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("renders Calendar component", () => {
        render(
            <CalendarProvider>
                <Calendar programData={mockProgramData} />
            </CalendarProvider>
        );

        expect(screen.getByText("CalendarTitle")).toBeInTheDocument();
        expect(screen.getByText("LanguageSwitcher")).toBeInTheDocument();
        expect(screen.getByText("Add Activity")).toBeInTheDocument();
    });

    test("opens AddActivityModal when Add Activity button is clicked", () => {
        render(
            <CalendarProvider>
                <Calendar programData={mockProgramData} />
            </CalendarProvider>
        );

        fireEvent.click(screen.getByText("Add Activity"));
        expect(screen.getByTestId("add-activity-modal")).toBeInTheDocument();
    });

    test("displays activities on the correct date", () => {
        render(
            <CalendarProvider>
                <Calendar programData={mockProgramData} />
            </CalendarProvider>
        );

        expect(screen.getByText("Test Activity")).toBeInTheDocument();
    });
});