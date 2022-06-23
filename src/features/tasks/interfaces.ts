import {AxiosResponse} from "axios";
import {APIMetaData, BaseAPIQuery} from "../../common/interfaces";
import {TaskStatus} from "./enums";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  datetime: string;
  created: string;
  updated: string;
  folder_id: string;
}

export interface TaskFilter extends BaseAPIQuery<Task> {
  status?: TaskStatus;
  min_date?: string;
  max_date?: string;
}

export interface CreateTaskDTO {
  title: string;
  date: string;
  description: string;
}

export interface UpdateTaskDTO extends Partial<CreateTaskDTO> {
  status?: TaskStatus;
}

export interface TaskState {
  tasks: Task[];
  filter: TaskFilter;
  loading: boolean;
}

export interface TasksAPI {
  fetchTasksByFolder: (
    id: number,
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
