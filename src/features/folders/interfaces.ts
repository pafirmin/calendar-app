import { AxiosResponse } from "axios";
import { BaseAPIQuery, APIMetaData } from "../../common/interfaces";

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

export interface FoldersAPI {
  fetchFolders: (
    f?: FolderFilter
  ) => Promise<AxiosResponse<{ metadata: APIMetaData; folders: Folder[] }>>;
  createFolder: (
    b: CreateFolderDTO
  ) => Promise<AxiosResponse<{ folder: Folder }>>;
  updateFolder: (
    id: number,
    b: UpdateFolderDTO
  ) => Promise<AxiosResponse<{ folder: Folder }>>;
  deleteFolder: (id: number) => Promise<AxiosResponse>;
}
