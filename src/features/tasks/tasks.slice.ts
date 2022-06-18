import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import tasksApi from "./tasks.api";

export enum TaskStatus {
  PENDING = "pending",
  URGENT = "urgent",
  CANCELLED = "cancelled",
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  datetime: string;
  created: string;
  folder_id: string;
}

export interface TaskFilter {
  status: TaskStatus;
  min_date: string;
  max_date: string;
  page: number;
  page_size: number;
  sort: string;
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
  entities: Task[];
  loading: boolean;
}

const initialState: TaskState = {
  entities: [],
  loading: false,
};

export const fetchTasksByFolder = createAsyncThunk(
  "tasks/fetch",
  async (payload: { folderId: number; params: TaskFilter }) => {
    const res = await tasksApi.fetchTasksByFolder(
      payload.folderId,
      payload.params
    );

    return res.data;
  }
);

export const createTask = createAsyncThunk(
  "tasks/create",
  async (payload: { folderId: number; body: CreateTaskDTO }) => {
    const res = await tasksApi.createTask(payload.folderId, payload.body);

    return res.data;
  }
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async (payload: { id: number; body: UpdateTaskDTO }) => {
    const res = await tasksApi.updateTask(payload.id, payload.body);

    return res.data;
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (id: number) => {
    const res = await tasksApi.deleteTask(id);

    if (res.status === 200) {
      return id;
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksByFolder.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.entities = payload.tasks;
      })
      .addCase(fetchTasksByFolder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.fulfilled, (state, { payload }) => {
        state.entities.unshift(payload.task);
      })
      .addCase(updateTask.fulfilled, (state, { payload }) => {
        state.entities = state.entities.map((task) =>
          task.id === payload.task.id ? payload.task : task
        );
      })
      .addCase(deleteTask.fulfilled, (state, { payload }) => {
        state.entities = state.entities.filter((task) => task.id !== payload);
      });
  },
});

export const selectTask = (state: RootState) => state.tasks.entities;

export default taskSlice.reducer;
