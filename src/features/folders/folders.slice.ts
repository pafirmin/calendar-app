import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
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
  folders: Folder[];
  loading: boolean;
  activeFolderId?: number;
}

const initialState: FolderState = {
  folders: [],
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

export const createFolder = createAsyncThunk(
  "folders/create",
  async (body: CreateFolderDTO) => {
    const res = await foldersApi.createFolder(body);

    return res.data;
  }
);

export const updateFolder = createAsyncThunk(
  "folders/update",
  async (payload: { id: number; body: UpdateFolderDTO }) => {
    const res = await foldersApi.updateFolder(payload.id, payload.body);

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
  reducers: {
    setActiveFolder: (state, action: PayloadAction<number>) => {
      state.activeFolderId = action.payload;
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
        state.folders.unshift(payload.folder);
      })
      .addCase(updateFolder.fulfilled, (state, { payload }) => {
        state.folders = state.folders.map((folder) =>
          folder.id === payload.folder.id ? payload.folder : folder
        );
      })
      .addCase(deleteFolder.fulfilled, (state, { payload }) => {
        state.folders = state.folders.filter(
          (folder) => folder.id !== payload
        );
      });
  },
});

export const { setActiveFolder } = folderSlice.actions;

export const selectFolders = (state: RootState) => state.folders.folders;

export const selectActiveFolder = (state: RootState) =>
  state.folders.folders.find((f) => f.id === state.folders.activeFolderId);

export default folderSlice.reducer;
