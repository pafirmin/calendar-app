import { isNil, omitBy } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { showError } from "../alerts/alerts.slice";
import { Task, TaskFilter } from "./interfaces";
import { fetchTasks } from "./tasks.slice";

export function useFetchTasks(initialState: TaskFilter = {}) {
  const [tasksFilter, setTasksFilter] = useState<TaskFilter>(initialState);
  const dispatch = useAppDispatch();
  const selected = useAppSelector(({ folders }) => folders.selected);
  const { entities: tasks } = useAppSelector(({ tasks }) => tasks);

  const setTaskFilter = (f: TaskFilter | ((p: TaskFilter) => TaskFilter)) => {
    let newState: TaskFilter;

    if (typeof f === "function") {
      newState = f(tasksFilter);
    } else {
      newState = f;
    }

    setTasksFilter(omitBy({ ...tasksFilter, newState }, isNil));
  };

  const tasksByDate = useMemo(
    () =>
      tasks
        .filter((task) => selected.includes(task.folder_id))
        .reduce<Record<string, Task[]>>((obj, task) => {
          const date = task.datetime.slice(0, 10);

          if (obj[date]) {
            obj[date].push(task);

            return obj;
          }

          obj[date] = new Array(task);

          return obj;
        }, {}),
    [tasks, selected]
  );

  const handleFetchTasks = useCallback(async () => {
    try {
      await dispatch(fetchTasks(tasksFilter)).unwrap();
    } catch (err: any) {
      dispatch(showError(err.message));
    }
  }, [tasksFilter, dispatch]);

  useEffect(() => {
    if (selected.length > 0) {
      handleFetchTasks();
    }
  }, [dispatch, handleFetchTasks, selected.length]);

  return [tasksByDate, { values: tasksFilter, set: setTaskFilter }] as const;
}
