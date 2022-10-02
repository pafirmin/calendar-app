import { Box, Paper, Typography } from "@mui/material";
import { format } from "date-fns";
import { Task as ITask } from "./interfaces";

interface Props {
  task: ITask;
}

const Task = ({ task }: Props) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1, gap: 1 }}>
      <Typography
        component="time"
        sx={(theme) => ({ color: theme.palette.text.secondary })}
      >
        {format(new Date(task.datetime), "HH:mm")}{" "}
      </Typography>
      <Paper key={task.id} sx={{ padding: 2, width: "100%" }}>
        <Typography variant="h4">{task.title}</Typography>
        <Typography sx={(theme) => ({ color: theme.palette.text.secondary })}>
          {task.description}
        </Typography>
      </Paper>
    </Box>
  );
};

export default Task;
