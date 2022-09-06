import { isNil, omitBy } from "lodash";
import { useState } from "react";
import { TaskFilter } from "./interfaces";

export function useTasksFilter(
  initialState: TaskFilter = {}
): [TaskFilter, (f: TaskFilter) => void] {
  const [filter, setFilter] = useState<TaskFilter>(initialState);

  const setTaskFilter = (f: TaskFilter) => {
    const newState = omitBy({ ...filter, f }, isNil);

    setFilter(newState);
  };

  return [filter, setTaskFilter];
}

