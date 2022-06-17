import { AxiosResponse } from "axios";
import axios from "../../axios";
import { APIMetaData } from "../../common/interfaces";
import { CreateTaskDTO, Task, TaskFilter, UpdateTaskDTO } from "./tasks.slice";

const fetchTasksByFolder = async (
  folderId: number,
  params: TaskFilter
): Promise<AxiosResponse<{ metadata: APIMetaData; tasks: Task[] }>> =>
  axios.get(`folders/${folderId}/tasks`, { params });

const createTask = async (
  folderId: number,
  dto: CreateTaskDTO
): Promise<AxiosResponse<{ task: Task }>> =>
  axios.post(`folders/${folderId}/tasks`, dto);

const updateTask = async (
  id: number,
  dto: UpdateTaskDTO
): Promise<AxiosResponse<{ task: Task }>> => axios.patch(`/tasks/${id}`, dto);

const deleteTask = async (id: number): Promise<AxiosResponse> =>
  axios.delete(`/tasks/${id}`);

const tasksApi = {
  fetchTasksByFolder,
  createTask,
  updateTask,
  deleteTask,
};

export default tasksApi;
