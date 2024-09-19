import styled from "styled-components";

export const CalendarHeader = styled.div`
  background-color: white;
  border-bottom: 2px solid rgb(93, 175, 116);
  color: rgba(0, 0, 0, 0.8);
  display: grid;
  font-family: "Work Sans", sans-serif;
  font-size: 18px;
  font-weight: 700;
  grid-template-columns: repeat(7, 1fr);
  height: 60px;
  line-height: 60px;
`;

export const DayName = styled.div`
  align-items: center;
  border-right: 2px solid rgb(93, 175, 116);
  display: flex;
  font-family: "Work Sans", sans-serif;
  font-size: 16px;
  font-weight: 700;
  height: 100%;
  justify-content: center;
  &:last-child {
    border-right: none;
  }
`;

export const Header = styled.h1`
  background-color: white;
  color: rgba(0, 0, 0, 0.8);
  font-family: "Fjalla One", sans-serif;
  font-size: 48px;
  font-weight: 700;
  margin: 0;
  padding: 20px 0;
  text-align: center;
  flex: 1;
`;