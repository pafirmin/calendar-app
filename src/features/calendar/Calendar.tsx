import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { fetchTasks } from "../tasks/tasks.slice";

const Calendar = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {}, [dispatch]);

  return <div></div>;
};

export default Calendar;
