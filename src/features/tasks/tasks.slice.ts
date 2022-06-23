import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StatusCodes } from "http-status-codes";
import { omitBy, isNil } from "lodash";
import { AppAPI } from "../../app/api";
import { RootState } from "../../app/store";
import { APIMetaData } from "../../common/interfaces";
import { FieldErrors } from "../../common/types";
import {
  TaskState,
  Task,
  CreateTaskDTO,
  UpdateTaskDTO,
  TaskFilter,
} from "./interfaces";
import tasksApi from "./tasks.api";

const initialState: TaskState = {
  tasks: [],
  filter: {
    min_date: new Date().toISOString(),
  },
  loading: false,
};

export const fetchTasksByFolder = createAsyncThunk<
  { metadata: APIMetaData; tasks: Task[] },
  number,
  { extra: AppAPI }
>("tasks/fetch", async (payload: number, { getState, extra }) => {
  const { tasks } = getState() as { tasks: TaskState };
  const res = await extra.tasks.fetchTasksByFolder(payload, tasks.filter);

  return res.data;
});

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
      case StatusCodes.UNPROCESSABLE_ENTITY:
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
      case StatusCodes.UNPROCESSABLE_ENTITY:
        return rejectWithValue(err.errors as FieldErrors<UpdateTaskDTO>);
      default:
        throw err;
    }
  }
});

export const deleteTask = createAsyncThunk<number, number, { extra: AppAPI }>(
  "tasks/delete",
  async (id: number, { extra }) => {
    await extra.tasks.deleteTask(id);

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
