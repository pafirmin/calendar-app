import { Task } from "./interfaces";

export function tasksByDate(tasks: Task[]) {
  return tasks.reduce<Record<string, Task[]>>((obj, task) => {
    const date = task.datetime.slice(0, 10);

    if (obj[date]) {
      obj[date].push(task);

      return obj;
    }

    obj[date] = new Array(task);

    return obj;
  }, {});
}
