import authApi from "../features/auth/auth.api";
import {AuthAPI} from "../features/auth/interfaces";
import foldersApi from "../features/folders/folders.api";
import {FoldersAPI} from "../features/folders/interfaces";
import {TasksAPI} from "../features/tasks/interfaces";
import tasksApi from "../features/tasks/tasks.api";

export interface AppAPI {
  auth: AuthAPI,
  folders: FoldersAPI,
  tasks: TasksAPI,
}

const appApi: AppAPI = {
  auth: authApi,
  folders: foldersApi,
  tasks: tasksApi,
};

export default appApi
