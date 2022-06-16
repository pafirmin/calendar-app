import {AxiosResponse} from "axios";
import axios from "../../axios";
import { CreateFolderDTO, Folder } from "./folders.slice";

export const fetchFolders = (): Promise<AxiosResponse<Folder[]>> => axios.get("/folders");

export const createFolder = (dto: CreateFolderDTO): Promise<AxiosResponse<Folder>> =>
  axios.post("/folders", dto);

export const updateFolder = (id: number, dto: CreateFolderDTO): Promise<AxiosResponse<Folder>> =>
  axios.patch(`/folders/${id}`, dto);

export const deleteFolder = (id: number): Promise<AxiosResponse> => axios.delete(`/folders/${id}`);

const foldersApi = {
  fetchFolders,
  createFolder,
  updateFolder,
  deleteFolder,
};

export default foldersApi;
