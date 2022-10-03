import { styled } from "@mui/material";
import { Task } from "../tasks/interfaces";

const Wrapper = styled("div")(({ theme }) => ({
  padding: "50% 0",
  height: 0,
  position: "relative",
  backgroundColor: "#fff",
}));

const DayContent = styled("div")((theme) => ({
  position: "absolute",
  top: 0,
  left: 0,
  height: "100%",
  width: "100%",
}));

interface Props {
  tasks: Task[];
  day: number;
}

const CalendarDay = ({ tasks, day }: Props) => {
  return (
    <Wrapper>
      <DayContent>{day}</DayContent>
    </Wrapper>
  );
};

export default CalendarDay;
