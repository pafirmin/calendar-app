import { Box, styled } from "@mui/material";
import { Task } from "../tasks/interfaces";

interface Props {
  tasks: Task[];
  day: number;
  blank?: boolean;
}

const CalendarDay = ({ tasks = [], day, blank }: Props) => {
  return (
    <Box sx={{ padding: 1, backgroundColor: blank ? "#f1f1f1" : "#fff" }}>
      {day}
    </Box>
  );
};

export default CalendarDay;
