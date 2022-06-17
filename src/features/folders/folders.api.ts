import { AxiosResponse } from "axios";
import axios from "../../axios";
import { APIMetaData } from "../../common/interfaces";
import {
  CreateFolderDTO,
  Folder,
  FolderFilter,
  UpdateFolderDTO,
} from "./folders.slice";

export const fetchFolders = (
  params: FolderFilter
): Promise<AxiosResponse<{ metadata: APIMetaData; folders: Folder[] }>> =>
  axios.get("/users/me/folders", { params });

export const createFolder = (
  dto: CreateFolderDTO
): Promise<AxiosResponse<{ folder: Folder }>> =>
  axios.post("users/me/folders", dto);

export const updateFolder = (
  id: number,
  dto: UpdateFolderDTO
): Promise<AxiosResponse<{ folder: Folder }>> =>
  axios.patch(`/folders/${id}`, dto);

export const deleteFolder = (id: number): Promise<AxiosResponse> =>
  axios.delete(`/folders/${id}`);

const foldersApi = {
  fetchFolders,
  createFolder,
  updateFolder,
  deleteFolder,
};

export default foldersApi;
