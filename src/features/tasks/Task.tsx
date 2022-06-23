import { ListItem } from "@mui/material";
import { Task as ITask } from "./interfaces";

interface Props {
  task: ITask;
}

const Task = ({ task }: Props) => {
  return <ListItem key={task.id}>{task.title}</ListItem>;
};

export default Task;
