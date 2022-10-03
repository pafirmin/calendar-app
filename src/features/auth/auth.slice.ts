import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppAPI } from "../../app/api";
import { AuthState, User, Credentials } from "./interfaces";

const token = localStorage.getItem("access_token");

const initialState: AuthState = {
  token: token,
  user: null,
};

export const login = createAsyncThunk<
  { user: User; access_token: string },
  Credentials,
  { rejectValue: any; extra: AppAPI }
>("auth/login", async (creds, { rejectWithValue, extra: api }) => {
  try {
    const res = await api.auth.login(creds);

    localStorage.setItem("access_token", res.data.access_token);

    return res.data;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const fetchUser = createAsyncThunk<
  { user: User },
  undefined,
  { rejectValue: any, extra: AppAPI }
>("auth/fetch", async (_, { rejectWithValue, extra: api }) => {
  try {
    const res = await api.auth.fetchUser();

    return res.data;
  } catch (err) {
    return rejectWithValue(err);
  }
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
        state.token = payload.access_token;
        state.user = payload.user;
      })
      .addCase(fetchUser.fulfilled, (state, { payload }) => {
        state.user = payload.user;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
