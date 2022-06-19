import { ListItem } from "@mui/material";
import { Task as ITask } from "./tasks.slice";

interface Props {
  task: ITask;
}

const Task = ({ task }: Props) => {
  return <ListItem key={task.id}>{task.title}</ListItem>;
};

export default Task;
