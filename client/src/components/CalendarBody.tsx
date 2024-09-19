import styled from "styled-components";

export const CalendarBody = styled.div`
  display: grid;
  gap: 0px;
  grid-template-columns: repeat(7, 1fr);
  max-width: 100%;
  min-height: 450px;
`;

export const DayContainer = styled.div<{
  $isActive: boolean;
  $hasActivity: boolean;
  $isEmpty: boolean;
  $rowIndex: number;
  $colIndex: number;
  tabIndex: number;
}>`
  background-color: ${(props) =>
    props.$isActive ? "rgb(93, 175, 116)" : "white"};
  border-left: ${(props) =>
    props.$colIndex === 0 ? "none" : "1px solid rgb(93, 175, 116)"};
  border-right: ${(props) =>
    props.$colIndex === 6 ? "none" : "1px solid rgb(93, 175, 116)"};
  border-bottom: ${(props) =>
    props.$rowIndex === 5 ? "none" : "1px solid rgb(93, 175, 116)"};
  align-items: center;
  aspect-ratio: 1;
  border-top: 1px solid rgb(93, 175, 116);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding: 25px;
  text-align: center;
  transition: background-color 0.3s ease;
  width: 100%;
  &:hover,
  &:focus {
    background-color: ${(props) =>
      props.$isActive ? "rgb(93, 175, 116)" : "rgba(93, 175, 116, 0.1)"};
    outline: none;
  }
`;

export const DayNumber = styled.div<{ $hasActivity: boolean; $isActive: boolean }>`
  font-size: 64px;
  font-family: "Libre Franklin", sans-serif;
  font-weight: 700;
  color: ${(props) =>
    props.$isActive
      ? "white"
      : props.$hasActivity
      ? "rgb(93, 175, 116)"
      : "rgba(0, 0, 0, 0.8)"};
  line-height: 1;
  margin: 0;
`;

export const ActivityContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ActivityTitle = styled.div<{ $isActive: boolean }>`
  color: ${(props) => (props.$isActive ? "white" : "black")};
  font-family: "Libre Franklin", sans-serif;
  font-size: 10px;
  font-weight: 400;
  line-height: 1.2;
  text-align: center;
  text-transform: uppercase;
`;