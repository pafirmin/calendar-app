import { Box, Paper, Typography } from "@mui/material";
import { Task as ITask } from "./interfaces";

interface Props {
  task: ITask;
}

const Task = ({ task }: Props) => {
  return (
    <Paper key={task.id} sx={{ padding: 2, width: "100%" }}>
      <Typography variant="h6">{task.title}</Typography>
      <Typography sx={(theme) => ({ color: theme.palette.text.secondary })}>
        {task.description}
      </Typography>
    </Paper>
  );
};

export default Task;
