import { List, ListItem, Typography } from "@mui/material";
import { useMemo } from "react";
import { useFetchTasks } from "./hooks";
import Task from "./Task";
import { Box } from "@mui/system";
import { format } from "date-fns";

const TasksList = () => {
  const today = useMemo(() => new Date(), []);
  const [tasks, filters] = useFetchTasks({
    min_date: today.toISOString(),
  });

  return (
    <Box component="article">
      <List component="ol">
        {Object.keys(tasks)
          .sort()
          .map((date) => (
            <Box key={date} component="li" sx={{ marginBottom: 1 }}>
              <Typography variant="h3">
                <time>{format(new Date(date), "dd/MM/yyyy")}</time>
              </Typography>
              <List sx={{ paddingTop: 0 }}>
                {tasks[date].map((task) => (
                  <ListItem key={task.id} disableGutters>
                    <Task task={task} />
                  </ListItem>
                ))}
              </List>
            </Box>
          ))}
      </List>
    </Box>
  );
};

export default TasksList;
