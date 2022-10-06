import { isNil, omitBy } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Task, TaskFilter } from "./interfaces";
import { fetchTasks } from "./tasks.slice";

export function useFetchTasks(initialState: TaskFilter = {}) {
  const [filter, setFilter] = useState<TaskFilter>(initialState);
  const dispatch = useAppDispatch();
  const selected = useAppSelector(({ folders }) => folders.selected);
  const { entities: tasks } = useAppSelector(({ tasks }) => tasks);

  const setTaskFilter = (f: TaskFilter | ((p: TaskFilter) => TaskFilter)) => {
    let newState: TaskFilter;

    if (typeof f === "function") {
      newState = f(filter);
    } else {
      newState = f;
    }

    setFilter(omitBy({ ...filter, newState }, isNil));
  };

  const tasksByDate = useMemo(() => {
    return tasks.reduce<Record<string, Task[]>>((obj, task) => {
      const date = task.datetime.slice(0, 10);

      if (obj[date]) {
        obj[date].push(task);

        return obj;
      }

      obj[date] = new Array(task);

      return obj;
    }, {});
  }, [tasks]);

  const handleFetchTasks = useCallback(async () => {
    dispatch(fetchTasks({ ...filter, folder_id: selected }));
  }, [filter, dispatch, selected]);

  useEffect(() => {
    if (selected.length > 0) {
      handleFetchTasks();
    }
  }, [dispatch, handleFetchTasks, selected.length]);

  return {tasks: tasksByDate, tasksFilter: filter, setTaskFilter}
}
