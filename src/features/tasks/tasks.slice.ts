import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppAPI } from "../../app/api";
import { RootState } from "../../app/store";
import { APIMetaData } from "../../common/interfaces";
import {
  TaskState,
  Task,
  CreateTaskDTO,
  UpdateTaskDTO,
  TaskFilter,
} from "./interfaces";

const initialState: TaskState = {
  entities: [],
  newTaskDate: new Date().toISOString(),
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
>("tasks/fetch", async (payload, { rejectWithValue, extra: api }) => {
  try {
    const res = await api.tasks.fetchTasks(payload);

    return res.data;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const nextPage = createAsyncThunk<
  { metadata: APIMetaData; tasks: Task[] },
  TaskFilter,
  { extra: AppAPI }
>("tasks/fetch", async (payload, { getState, extra: api }) => {
  const { tasks } = getState() as RootState;
  const res = await api.tasks.fetchTasks({
    ...payload,
    page: tasks.metadata.current_page + 1,
  });

  return res.data;
});

export const createTask = createAsyncThunk<
  { task: Task },
  { folderId: number; body: CreateTaskDTO },
  {  extra: AppAPI }
>("tasks/create", async (payload, { rejectWithValue, extra: api }) => {
  try {
    const res = await api.tasks.createTask(payload.folderId, payload.body);

    return res.data;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const updateTask = createAsyncThunk<
  { task: Task },
  { id: number; body: UpdateTaskDTO },
  { extra: AppAPI }
>("tasks/update", async (payload, { rejectWithValue, extra: api }) => {
  try {
    const res = await api.tasks.updateTask(payload.id, payload.body);

    return res.data;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const deleteTask = createAsyncThunk<
  number,
  number,
  { extra: AppAPI; rejectValue: any }
>("tasks/delete", async (id: number, { rejectWithValue, extra: api }) => {
  try {
    await api.tasks.deleteTask(id);

    return id;
  } catch (err) {
    return rejectWithValue(err);
  }
});

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setNewTaskDate: (
      state,
      { payload }: PayloadAction<{ datetime: string }>
    ) => {
      state.newTaskDate = payload.datetime;
    },
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

export default taskSlice.reducer;
