import { AxiosResponse } from "axios";
import axios from "../axios";
import { CreateUserDTO, Credentials, User } from "./auth/auth.slice";

export const login = (
  credentials: Credentials
): Promise<AxiosResponse<{ token: string; user: User }>> => {
  return axios.post("/auth/login", credentials);
};

export const createUser = (
  dto: CreateUserDTO
): Promise<AxiosResponse<{ user: User }>> => {
  return axios.post("/users", dto);
};

export const fetchUser = (): Promise<AxiosResponse<{ user: User }>> => {
  return axios.get("/users/me");
};

const authApi = {
  login,
  createUser,
  fetchUser,
};

export default authApi;
