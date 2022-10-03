import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StatusCodes } from "http-status-codes";
import { AppAPI } from "../../app/api";
import { APIMetaData } from "../../common/interfaces";
import { FieldErrors, ValidationFailedResponse } from "../../common/types";
import {
  FolderState,
  FolderFilter,
  Folder,
  CreateFolderDTO,
  UpdateFolderDTO,
} from "./interfaces";

const initialState: FolderState = {
  entities: [],
  loading: false,
  selected: [],
};

export const fetchFolders = createAsyncThunk<
  { folders: Folder[]; metadata: APIMetaData },
  FolderFilter | undefined,
  { extra: AppAPI }
>("folders/fetch", async (payload = {}, { rejectWithValue, extra: api }) => {
  try {
    const res = await api.folders.fetchFolders(payload);

    return res.data;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const createFolder = createAsyncThunk<
  { folder: Folder },
  CreateFolderDTO,
  { extra: AppAPI }
>("folders/create", async (body, { rejectWithValue, extra: api }) => {
  try {
    const res = await api.folders.createFolder(body);

    return res.data;
  } catch (err: any) {
    return rejectWithValue(err);
  }
});

export const updateFolder = createAsyncThunk<
  { folder: Folder },
  { id: number; body: UpdateFolderDTO },
  { extra: AppAPI }
>("folders/update", async (payload, { rejectWithValue, extra: api }) => {
  try {
    const res = await api.folders.updateFolder(payload.id, payload.body);

    return res.data;
  } catch (err: any) {
    return rejectWithValue(err);
  }
});

export const deleteFolder = createAsyncThunk<number, number, { extra: AppAPI }>(
  "/folders/delete",
  async (id: number, { extra: api }) => {
    await api.folders.deleteFolder(id);

    return id;
  }
);

export const folderSlice = createSlice({
  name: "folders",
  initialState,
  reducers: {
    toggleSelected: (state, { payload }: PayloadAction<Folder>) => {
      if (state.selected.includes(payload.id)) {
        state.selected = state.selected.filter((id) => id !== payload.id);
        return;
      }
      state.selected.push(payload.id);
    },
    selectFolder: (state, { payload }: PayloadAction<Folder>) => {
      state.selected.push(payload.id);
    },
    deselectFolder: (state, { payload }: PayloadAction<Folder>) => {
      state.selected = state.selected.filter((id) => id !== payload.id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFolders.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.entities = payload.folders;
        state.selected = payload.folders.map((folder) => folder.id);
      })
      .addCase(fetchFolders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFolders.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createFolder.fulfilled, (state, { payload }) => {
        const i = state.entities.findIndex((f) => f.name > payload.folder.name);
        state.entities.splice(i, 0, payload.folder);
      })
      .addCase(updateFolder.fulfilled, (state, { payload }) => {
        state.entities = state.entities.map((folder) =>
          folder.id === payload.folder.id ? payload.folder : folder
        );
      })
      .addCase(deleteFolder.fulfilled, (state, { payload }) => {
        state.entities = state.entities.filter(
          (folder) => folder.id !== payload
        );
      });
  },
});

export const { toggleSelected, selectFolder, deselectFolder } =
  folderSlice.actions;

export default folderSlice.reducer;
