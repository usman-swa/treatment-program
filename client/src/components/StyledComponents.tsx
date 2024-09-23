import { styled } from "styled-components";

export const AddActivityButton = styled.button`
  background-color: rgb(93, 175, 116);
  border: none;
  border-radius: 24px;
  color: white;
  font-size: 16px;
  padding: 10px 20px;
  cursor: pointer;
`;

export const CalendarContainer = styled.div`
  background-color: white;
  border: 4px solid rgb(93, 175, 116);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  margin: 24px auto 0;
  max-width: 1200px;
  padding: 0;
  width: 100%;
`;

export const HeaderWrapper = styled.div`
  background-color: white;
  border-bottom: 1px solid rgb(93, 175, 116);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
`;