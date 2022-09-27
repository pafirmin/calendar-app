import { List, ListItem, Paper, Typography } from "@mui/material";
import { Fragment, useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { showError } from "../alerts/alerts.slice";
import { useTasksFilter } from "./hooks";
import Task from "./Task";
import { clearTasks, fetchTasks } from "./tasks.slice";
import { addDays, format } from "date-fns";
import { dateRange } from "../../common/utils";
import { Dictionary } from "lodash";
import { Task as ITask } from "./interfaces";
import { Box } from "@mui/system";

const TasksList = () => {
  const today = useMemo(() => new Date(), []);
  const dispatch = useAppDispatch();
  const selected = useAppSelector(({ folders }) => folders.selected);
  const { entities: tasks } = useAppSelector(({ tasks }) => tasks);
  const [taskFilter, setTaskFilter] = useTasksFilter({
    min_date: today.toISOString().slice(0, 10),
    max_date: addDays(today, 200).toISOString().slice(0, 10),
  });

  const tasksByDate = useMemo(
    () =>
      tasks.reduce<Dictionary<ITask[]>>((obj, task) => {
        const date = task.datetime.slice(0, 10);

        if (obj[date]) {
          obj[date].push(task);

          return obj;
        }

        obj[date] = new Array(task);

        return obj;
      }, {}),
    [tasks]
  );

  const handleFetchTasks = useCallback(async () => {
    try {
      await dispatch(fetchTasks(taskFilter)).unwrap();
    } catch (err: any) {
      dispatch(showError(err.message));
    }
  }, [taskFilter, dispatch]);

  useEffect(() => {
    if (selected.length > 0) {
      handleFetchTasks();
    }

    return () => void dispatch(clearTasks());
  }, [dispatch, handleFetchTasks, selected.length]);

  return (
    <Box component="article" sx={{ margin: 1 }}>
      <List component="ol">
        {Object.keys(tasksByDate).map((date) => (
          <li key={date}>
            <Typography variant="h5">
              {format(new Date(date), "dd/MM/yyyy")}
            </Typography>
            <List>
              {tasksByDate[date].map((task) => (
                <ListItem disableGutters>
                  <Task key={task.id} task={task} />
                </ListItem>
              ))}
            </List>
          </li>
        ))}
      </List>
    </Box>
  );
};

export default TasksList;
