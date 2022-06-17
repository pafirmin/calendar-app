import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import foldersApi from "./folders.api";

export interface Folder {
  id: number;
  name: string;
  created: string;
  user_id: number;
}

export interface FolderFilter {
  page: number;
  page_size: number;
  sort: string;
}

export interface CreateFolderDTO {
  name: string;
}

export interface UpdateFolderDTO extends Partial<CreateFolderDTO> {}

export interface FolderState {
  entities: Folder[];
  loading: boolean;
}

const initialState: FolderState = {
  entities: [],
  loading: false,
};

export const fetchFolders = createAsyncThunk(
  "folders/fetch",
  async (params: FolderFilter) => {
    const res = await foldersApi.fetchFolders(params);

    return res.data;
  }
);

export const createFolder = createAsyncThunk(
  "folders/create",
  async (dto: CreateFolderDTO) => {
    const res = await foldersApi.createFolder(dto);

    return res.data;
  }
);

export const updateFolder = createAsyncThunk(
  "folders/update",
  async (payload: { id: number; dto: UpdateFolderDTO }) => {
    const res = await foldersApi.updateFolder(payload.id, payload.dto);

    return res.data;
  }
);

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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFolders.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.entities = payload.folders;
      })
      .addCase(fetchFolders.pending, (state) => {
        state.loading = true;
      })
      .addCase(createFolder.fulfilled, (state, { payload }) => {
        state.entities.unshift(payload.folder);
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

export const selectFolders = (state: RootState) => state.folders.entities;

export default folderSlice.reducer;
