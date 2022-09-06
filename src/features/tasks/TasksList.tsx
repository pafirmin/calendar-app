import { List } from "@mui/material";
import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { showError } from "../alerts/alerts.slice";
import { useTasksFilter } from "./hooks";
import Task from "./Task";
import { clearTasks, fetchTasks } from "./tasks.slice";
import { addDays } from "date-fns";
import { dateRange } from "../../common/utils";

const TasksList = () => {
  const today = useMemo(() => new Date(), []);
  const dispatch = useAppDispatch();
  const selected = useAppSelector(({ folders }) => folders.selected);
  const { entities: tasks } = useAppSelector(({ tasks }) => tasks);
  const [taskFilter, setTaskFilter] = useTasksFilter({
    min_date: today.toISOString().slice(0, 10),
    max_date: addDays(today, 1).toISOString().slice(0, 10),
  });
  const dates = useMemo(
    () =>
      dateRange(
        new Date(taskFilter.min_date as string),
        new Date(taskFilter.max_date as string)
      ),
    [taskFilter.min_date, taskFilter.max_date]
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
    <List>
      {tasks.map((task) => (
        <Task key={task.id} task={task} />
      ))}
    </List>
  );
};

export default TasksList;
