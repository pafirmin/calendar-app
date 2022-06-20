import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { omitBy, isNil } from "lodash";
import { RootState } from "../../app/store";
import { BaseAPIQuery } from "../../common/interfaces";
import { FieldErrors } from "../../common/types";
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

const initialState: TaskState = {
  tasks: [],
  filter: {
    min_date: new Date().toISOString(),
  },
  loading: false,
};

export const fetchTasksByFolder = createAsyncThunk(
  "tasks/fetch",
  async (payload: number, { getState }) => {
    const { tasks } = getState() as { tasks: TaskState };
    const res = await tasksApi.fetchTasksByFolder(payload, tasks.filter);

    return res.data;
  }
);

export const createTask = createAsyncThunk<
  { task: Task },
  { folderId: number; body: CreateTaskDTO },
  { rejectValue: FieldErrors<CreateTaskDTO> }
>("tasks/create", async (payload, { rejectWithValue }) => {
  try {
    const res = await tasksApi.createTask(payload.folderId, payload.body);

    return res.data;
  } catch (err: any) {
    switch (err.status) {
      case 400:
        return rejectWithValue(err.errors as FieldErrors<CreateTaskDTO>);
      default:
        throw err;
    }
  }
});

export const updateTask = createAsyncThunk<
  { task: Task },
  { id: number; body: UpdateTaskDTO },
  { rejectValue: FieldErrors<UpdateTaskDTO> }
>("tasks/update", async (payload, { rejectWithValue }) => {
  try {
    const res = await tasksApi.updateTask(payload.id, payload.body);

    return res.data;
  } catch (err: any) {
    switch (err.status) {
      case 400:
        return rejectWithValue(err.errors as FieldErrors<UpdateTaskDTO>);
      default:
        throw err;
    }
  }
});

export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (id: number) => {
    await tasksApi.deleteTask(id);

    return id;
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setFilters: (state, { payload }: PayloadAction<TaskFilter>) => {
      state.filter = omitBy<TaskFilter>(
        Object.assign(state.filter, payload),
        isNil
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksByFolder.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tasks = payload.tasks;
      })
      .addCase(fetchTasksByFolder.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasksByFolder.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createTask.fulfilled, (state, { payload }) => {
        state.tasks.unshift(payload.task);
      })
      .addCase(updateTask.fulfilled, (state, { payload }) => {
        state.tasks = state.tasks.map((task) =>
          task.id === payload.task.id ? payload.task : task
        );
      })
      .addCase(deleteTask.fulfilled, (state, { payload }) => {
        state.tasks = state.tasks.filter((task) => task.id !== payload);
      });
  },
});

export const { setFilters } = taskSlice.actions;

export const selectTasks = (state: RootState) => state.tasks.tasks;

export default taskSlice.reducer;
