import { isNil, omitBy } from "lodash";
import { Dispatch, SetStateAction, useState } from "react";
import { TaskFilter } from "./interfaces";

export function useTasksFilter(
  initialState: TaskFilter = {}
): [TaskFilter, Dispatch<SetStateAction<TaskFilter>>] {
  const [filter, setFilter] = useState<TaskFilter>(initialState);

  const setTaskFilter = (f: TaskFilter | ((p: TaskFilter) => TaskFilter)) => {
    let newState: TaskFilter;

    if (typeof f === "function") {
      newState = f(filter)
    } else {
      newState = f
    }

    setFilter(omitBy({ ...filter, newState }, isNil));
  };

  return [filter, setTaskFilter];
}

