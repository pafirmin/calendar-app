import { List } from "@mui/material";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectActiveFolder } from "../folders/folders.slice";
import Task from "./Task";
import { fetchTasksByFolder } from "./tasks.slice";

const TasksList = () => {
  const dispatch = useAppDispatch();
  const { tasks } = useAppSelector(({ tasks }) => tasks);
  const activeFolder = useAppSelector(selectActiveFolder);

  useEffect(() => {
    if (activeFolder) {
      dispatch(fetchTasksByFolder({ folderId: activeFolder.id }));
    }
  }, [activeFolder, dispatch]);

  return (
    <List>
      {tasks.map((task) => (
        <Task task={task} />
      ))}
    </List>
  );
};

export default TasksList;
