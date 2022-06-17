import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "../auth.api";

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
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const login = createAsyncThunk("auth/login", async (creds: Credentials) => {
  const res = await authApi.login(creds);

  localStorage.setItem('access_token', JSON.stringify(res.data.token));

  return res.data;
});

const fetchUser = createAsyncThunk("auth/fetch", async () => {
  const res = await authApi.fetchUser();

  return res.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, { payload }) => {
        state.isAuthenticated = true;
        state.user = payload.user;
      })
      .addCase(fetchUser.fulfilled, (state, { payload }) => {
        state.isAuthenticated = true;
        state.user = payload.user;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
