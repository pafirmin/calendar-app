import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "./auth.api";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface CreateUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}

const token = localStorage.getItem('access_token')

const initialState: AuthState = {
  token: token,
  user: null,
};

export const login = createAsyncThunk("auth/login", async (creds: Credentials) => {
  const res = await authApi.login(creds);

  localStorage.setItem('access_token', res.data.token);

  return res.data;
});

export const fetchUser = createAsyncThunk("auth/fetch", async () => {
  const res = await authApi.fetchUser();

  return res.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, { payload }) => {
        state.token = payload.token;
        state.user = payload.user;
      })
      .addCase(fetchUser.fulfilled, (state, { payload }) => {
        state.user = payload.user;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
