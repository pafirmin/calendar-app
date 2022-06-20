import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isNil, omitBy } from "lodash";
import { RootState } from "../../app/store";
import { BaseAPIQuery } from "../../common/interfaces";
import { FieldErrors } from "../../common/types";
import foldersApi from "./folders.api";

export interface Folder {
  id: number;
  name: string;
  created: string;
  user_id: number;
}

export interface FolderFilter extends BaseAPIQuery<Folder> {}

export interface CreateFolderDTO {
  name: string;
}

export interface UpdateFolderDTO extends Partial<CreateFolderDTO> {}

export interface FolderState {
  folders: Folder[];
  filter: FolderFilter;
  loading: boolean;
  activeFolderId?: number;
}

const initialState: FolderState = {
  folders: [],
  filter: { sort: "name" },
  loading: false,
  activeFolderId: undefined,
};

export const fetchFolders = createAsyncThunk(
  "folders/fetch",
  async (params?: FolderFilter) => {
    const res = await foldersApi.fetchFolders(params);

    return res.data;
  }
);

export const createFolder = createAsyncThunk<
  { folder: Folder },
  CreateFolderDTO,
  { rejectValue: FieldErrors<CreateFolderDTO> }
>("folders/create", async (body, { rejectWithValue }) => {
  try {
    const res = await foldersApi.createFolder(body);

    return res.data;
  } catch (err: any) {
    switch (err.status) {
      case 400:
        return rejectWithValue(err as FieldErrors<CreateFolderDTO>);
      default:
        throw err;
    }
  }
});

export const updateFolder = createAsyncThunk<
  { folder: Folder },
  { id: number; body: UpdateFolderDTO },
  { rejectValue: FieldErrors<UpdateFolderDTO> }
>("folders/update", async (payload, { rejectWithValue }) => {
  try {
    const res = await foldersApi.updateFolder(payload.id, payload.body);

    return res.data;
  } catch (err: any) {
    switch (err.status) {
      case 400:
        return rejectWithValue(err as FieldErrors<UpdateFolderDTO>);
      default:
        throw err;
    }
  }
});

export const deleteFolder = createAsyncThunk(
  "/folders/delete",
  async (id: number) => {
    const res = await foldersApi.deleteFolder(id);

    if (res.status === 200) {
      return id;
    }
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
        const i = state.folders.findIndex((f) => f.name > payload.folder.name)
        state.folders.splice(i, 0, payload.folder)
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
