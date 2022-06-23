import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StatusCodes } from "http-status-codes";
import { isNil, omitBy } from "lodash";
import { AppAPI } from "../../app/api";
import { RootState } from "../../app/store";
import { APIMetaData } from "../../common/interfaces";
import { FieldErrors } from "../../common/types";
import {
  FolderState,
  FolderFilter,
  Folder,
  CreateFolderDTO,
  UpdateFolderDTO,
} from "./interfaces";

const initialState: FolderState = {
  folders: [],
  filter: { sort: "name" },
  loading: false,
  activeFolderId: undefined,
};

export const fetchFolders = createAsyncThunk<
  { folders: Folder[]; metadata: APIMetaData },
  FolderFilter | undefined,
  { extra: AppAPI }
>("folders/fetch", async (params = {}, { extra }) => {
  const res = await extra.folders.fetchFolders(params);

  return res.data;
});

export const createFolder = createAsyncThunk<
  { folder: Folder },
  CreateFolderDTO,
  { rejectValue: FieldErrors<CreateFolderDTO>; extra: AppAPI }
>("folders/create", async (body, { rejectWithValue, extra }) => {
  try {
    const res = await extra.folders.createFolder(body);

    return res.data;
  } catch (err: any) {
    switch (err.status) {
      case StatusCodes.UNPROCESSABLE_ENTITY:
        return rejectWithValue(err as FieldErrors<CreateFolderDTO>);
      default:
        throw err;
    }
  }
});

export const updateFolder = createAsyncThunk<
  { folder: Folder },
  { id: number; body: UpdateFolderDTO },
  { rejectValue: FieldErrors<CreateFolderDTO>; extra: AppAPI }
>("folders/update", async (payload, { rejectWithValue, extra }) => {
  try {
    const res = await extra.folders.updateFolder(payload.id, payload.body);

    return res.data;
  } catch (err: any) {
    switch (err.status) {
      case StatusCodes.UNPROCESSABLE_ENTITY:
        return rejectWithValue(err as FieldErrors<UpdateFolderDTO>);
      default:
        throw err;
    }
  }
});

export const deleteFolder = createAsyncThunk<number, number, { extra: AppAPI }>(
  "/folders/delete",
  async (id: number, { extra }) => {
    await extra.folders.deleteFolder(id);

    return id;
  }
);

export const folderSlice = createSlice({
  name: "folders",
  initialState,
  reducers: {
    setActiveFolder: (state, { payload }: PayloadAction<number>) => {
      state.activeFolderId = payload;
    },
    setFilters: (state, { payload }: PayloadAction<FolderFilter>) => {
      state.filter = omitBy<FolderFilter>(
        Object.assign(state.filter, payload),
        isNil
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFolders.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.folders = payload.folders;
        state.activeFolderId = payload.folders[0]?.id;
      })
      .addCase(fetchFolders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFolders.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createFolder.fulfilled, (state, { payload }) => {
        const i = state.folders.findIndex((f) => f.name > payload.folder.name);
        state.folders.splice(i, 0, payload.folder);
      })
      .addCase(updateFolder.fulfilled, (state, { payload }) => {
        state.folders = state.folders.map((folder) =>
          folder.id === payload.folder.id ? payload.folder : folder
        );
      })
      .addCase(deleteFolder.fulfilled, (state, { payload }) => {
        state.folders = state.folders.filter((folder) => folder.id !== payload);
      });
  },
});

export const { setActiveFolder } = folderSlice.actions;

export const selectFolders = (state: RootState) => state.folders.folders;

export const selectActiveFolder = (state: RootState) =>
  state.folders.folders.find((f) => f.id === state.folders.activeFolderId);

export default folderSlice.reducer;
