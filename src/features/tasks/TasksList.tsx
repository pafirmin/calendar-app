import { List } from "@mui/material";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectActiveFolder } from "../folders/folders.slice";
import Task from "./Task";
import { fetchTasksByFolder } from "./tasks.slice";

const TasksList = () => {
  const dispatch = useAppDispatch();
  const activeFolder = useAppSelector(selectActiveFolder);
  const { tasks, filter } = useAppSelector(({ tasks }) => tasks);

  useEffect(() => {
    if (activeFolder) {
      dispatch(fetchTasksByFolder(activeFolder.id));
    }
  }, [activeFolder, filter, dispatch]);

  return (
    <List>
      {tasks.map((task) => (
        <Task task={task} />
      ))}
    </List>
  );
};

export default TasksList;
