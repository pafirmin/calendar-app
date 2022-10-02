import { AxiosResponse } from "axios";
import { APIMetaData, BaseAPIQuery } from "../../common/interfaces";
import { TaskStatus } from "./enums";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  datetime: string;
  created: string;
  updated: string;
  folder_id: number;
}

export interface TaskFilter extends BaseAPIQuery<Task> {
  status?: TaskStatus;
  folder_id?: number[];
  min_date?: string;
  max_date?: string;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
  datetime: string;
}

export interface UpdateTaskDTO extends Partial<CreateTaskDTO> {
  status?: TaskStatus;
}

export interface TaskState {
  entities: Task[];
  newTaskDate: string;
  metadata: APIMetaData;
  loading: boolean;
}

export interface TasksAPI {
  fetchTasks: (
    p: TaskFilter
  ) => Promise<AxiosResponse<{ metadata: APIMetaData; tasks: Task[] }>>;
  createTask: (
    id: number,
    b: CreateTaskDTO
  ) => Promise<AxiosResponse<{ task: Task }>>;
  updateTask: (
    id: number,
    b: UpdateTaskDTO
  ) => Promise<AxiosResponse<{ task: Task }>>;
  deleteTask: (id: number) => Promise<AxiosResponse>;
}
