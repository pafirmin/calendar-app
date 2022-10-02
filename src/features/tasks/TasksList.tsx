import { IconButton, List, ListItem, Tooltip, Typography } from "@mui/material";
import { useMemo } from "react";
import { useFetchTasks } from "./hooks";
import Task from "./Task";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { Box } from "@mui/system";
import { format } from "date-fns";
import { useAppDispatch } from "../../app/hooks";
import { toggleDrawer } from "../layout/layout.slice";

const TasksList = () => {
  const dispatch = useAppDispatch();
  const today = useMemo(() => new Date(), []);
  const [tasks, filters] = useFetchTasks({
    min_date: today.toISOString(),
  });
  const handleClick = () => {
    dispatch(toggleDrawer({ anchor: "right", open: true }));
  };

  return (
    <Box
      component="article"
      sx={{
        marginLeft: { sm: 4 },
        height: "100%",
      }}
    >
      <Box
        component="header"
        sx={{
          paddingTop: 1,
          display: "flex",
          alignItems: "center",
          zIndex: 100,
        }}
      >
        <Typography variant="h2">Your schedule</Typography>
        <Tooltip title="Add a new event">
          <IconButton onClick={handleClick}>
            <NoteAddIcon color="secondary" />
          </IconButton>
        </Tooltip>
      </Box>
      <List
        sx={{
          height: "100%",
          overflowY: "scroll",
          paddingLeft: 2,
          paddingRight: 2,
          paddingBottom: 4,
        }}
        component="ol"
      >
        {Object.keys(tasks)
          .sort()
          .map((date) => (
            <Box key={date} component="li" sx={{ marginBottom: 2 }}>
              <Typography variant="h3" sx={{ marginLeft: 6 }}>
                <time>{format(new Date(date), "dd/MM/yyyy")}</time>
              </Typography>
              <List component="ol">
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
