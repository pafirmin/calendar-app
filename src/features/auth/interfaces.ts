import { AxiosResponse } from "axios";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  created: string;
  updated: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface CreateUserDTO {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}

export interface AuthAPI {
  login: (
    c: Credentials
  ) => Promise<AxiosResponse<{ access_token: string; user: User }>>;
  createUser: (b: CreateUserDTO) => Promise<AxiosResponse<{user: User}>>,
  fetchUser: () => Promise<AxiosResponse<{ user: User }>>
}
