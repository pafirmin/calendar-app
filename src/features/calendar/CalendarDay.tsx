import {
  Box,
  IconButton,
  List,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { useAppDispatch } from "../../app/hooks";
import { Task } from "../tasks/interfaces";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { setNewTaskDate } from "../tasks/tasks.slice";
import { toggleDrawer } from "../layout/layout.slice";

interface Props {
  tasks: Task[];
  date: Date;
  isToday?: boolean;
  isCurrMonth?: boolean;
  handleClickTask: (task: Task) => void;
}

const CalendarDay = ({
  tasks = [],
  date,
  isToday,
  isCurrMonth,
  handleClickTask,
}: Props) => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(setNewTaskDate(date.toISOString()));
    dispatch(toggleDrawer({ anchor: "right", open: true }));
  };

  return (
    <Box
      sx={{
        padding: "0 8px 8px 8px",
        border: isToday ? "1px solid red" : "",
        backgroundColor: isCurrMonth ? "#fff" : "#f1f1f1",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography fontWeight="bold">{date.getDate()}</Typography>
        <Tooltip title="Add new task">
          <IconButton size="small" onClick={handleClick}>
            <AddCircleOutlineIcon />
          </IconButton>
        </Tooltip>
      </Stack>
      <List disablePadding>
        {tasks.map((task) => (
          <Typography key={task.id} fontSize=".9rem" component="li">
            <time>{format(new Date(task.datetime), "HH:mm")} </time>
            <span onClick={() => handleClickTask(task)}>{task.title}</span>
          </Typography>
        ))}
      </List>
    </Box>
  );
};

export default CalendarDay;
