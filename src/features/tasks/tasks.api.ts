import { AxiosResponse } from "axios";
import axios from "../../axios";
import { APIMetaData } from "../../common/interfaces";
import {TasksAPI} from "./interfaces";
import { CreateTaskDTO, Task, TaskFilter, UpdateTaskDTO } from "./interfaces";

const fetchTasks = async (
  params?: TaskFilter
): Promise<AxiosResponse<{ metadata: APIMetaData; tasks: Task[] }>> =>
  axios.get(`/tasks`, { params });

const createTask = async (
  folderId: number,
  body: CreateTaskDTO
): Promise<AxiosResponse<{ task: Task }>> =>
  axios.post(`folders/${folderId}/tasks`, body);

const updateTask = async (
  id: number,
  body: UpdateTaskDTO
): Promise<AxiosResponse<{ task: Task }>> => axios.patch(`/tasks/${id}`, body);

const deleteTask = async (id: number): Promise<AxiosResponse> =>
  axios.delete(`/tasks/${id}`);

const tasksApi: TasksAPI = {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
};

export default tasksApi;
