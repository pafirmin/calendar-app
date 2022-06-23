import { AxiosResponse } from "axios";
import axios from "../../axios";
import {Credentials, User, CreateUserDTO, AuthAPI} from "./interfaces";

export const login = (
  credentials: Credentials
): Promise<AxiosResponse<{ access_token: string; user: User }>> => {
  return axios.post("/auth/login", credentials);
};

export const createUser = (
  body: CreateUserDTO
): Promise<AxiosResponse<{ user: User }>> => {
  return axios.post("/users", body);
};

export const fetchUser = (): Promise<AxiosResponse<{ user: User }>> => {
  return axios.get("/users/me");
};

const authApi: AuthAPI = {
  login,
  createUser,
  fetchUser,
};

export default authApi;
