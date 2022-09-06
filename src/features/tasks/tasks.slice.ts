import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { StatusCodes } from "http-status-codes";
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

const initialState: TaskState = {
  entities: [],
  loading: false,
  metadata: {
    current_page: 0,
    first_page: 0,
    last_page: 0,
    total_records: 0,
    page_size: 0,
  },
};

export const fetchTasks = createAsyncThunk<
  { metadata: APIMetaData; tasks: Task[] },
  TaskFilter,
  { extra: AppAPI }
>("tasks/fetch", async (payload, { getState, extra: api }) => {
  const { folders } = getState() as RootState;
  const res = await api.tasks.fetchTasks({
    ...payload,
    folder_id: folders.selected,
  });

  return res.data;
});

export const nextPage = createAsyncThunk<
  { metadata: APIMetaData; tasks: Task[] },
  TaskFilter,
  { extra: AppAPI }
>("tasks/fetch", async (payload, { getState, extra: api }) => {
  const { folders } = getState() as RootState;
  const res = await api.tasks.fetchTasks({
    ...payload,
    folder_id: folders.selected,
  });

  return res.data;
});

export const createTask = createAsyncThunk<
  { task: Task },
  { folderId: number; body: CreateTaskDTO },
  { rejectValue: FieldErrors<CreateTaskDTO>, extra: AppAPI }
>("tasks/create", async (payload, { rejectWithValue, extra: api }) => {
  try {
    const res = await api.tasks.createTask(payload.folderId, payload.body);

    return res.data;
  } catch (err: any) {
    switch (err.status) {
      case StatusCodes.UNPROCESSABLE_ENTITY:
        return rejectWithValue(err.fields as FieldErrors<CreateTaskDTO>);
      default:
        throw err;
    }
  }
});

export const updateTask = createAsyncThunk<
  { task: Task },
  { id: number; body: UpdateTaskDTO },
  { rejectValue: FieldErrors<UpdateTaskDTO>, extra: AppAPI }
>("tasks/update", async (payload, { rejectWithValue, extra: api }) => {
  try {
    const res = await api.tasks.updateTask(payload.id, payload.body);

    return res.data;
  } catch (err: any) {
    switch (err.status) {
      case StatusCodes.UNPROCESSABLE_ENTITY:
        return rejectWithValue(err.fields as FieldErrors<UpdateTaskDTO>);
      default:
        throw err;
    }
  }
});

export const deleteTask = createAsyncThunk<number, number, { extra: AppAPI }>(
  "tasks/delete",
  async (id: number, { extra: api }) => {
    await api.tasks.deleteTask(id);

    return id;
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTasks: (state) => {
      state.entities = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.entities = payload.tasks;
        state.metadata = payload.metadata;
      })
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createTask.fulfilled, (state, { payload }) => {
        state.entities.push(payload.task);
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

export const { clearTasks } = taskSlice.actions;

export default taskSlice.reducer;
