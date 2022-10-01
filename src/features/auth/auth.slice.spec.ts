import { configureStore } from "@reduxjs/toolkit";
import authReducer, { fetchUser, login, logout } from "./auth.slice";
import { AppAPI } from "../../app/api";
import { CreateUserDTO, Credentials, User } from "./interfaces";

describe("auth slice", () => {
  const mockUser: User = {
    id: 1,
    first_name: "Testy",
    last_name: "McTest",
    email: "test@example.com",
    created: "2022-12-12",
    updated: "2022-12-12",
  };

  const mockLoginResponse: { data: { user: User; access_token: string } } = {
    data: {
      user: mockUser,
      access_token: "1234",
    },
  };

  const mockApi = {
    auth: {
      login: (_creds: Credentials) =>
        new Promise((resolve) => resolve(mockLoginResponse)),
      createUser: (_dto: CreateUserDTO) =>
        new Promise((resolve) => resolve({ data: { user: mockUser } })),
      fetchUser: () =>
        new Promise((resolve) => resolve({ data: { user: mockUser } })),
    },
  };

  it("should initialise state on login", async () => {
    const mockStore = configureStore({
      reducer: {
        auth: authReducer,
      },
      middleware: (defaults) => {
        return defaults({
          thunk: {
            extraArgument: mockApi as AppAPI,
          },
        });
      },
    });

    await mockStore.dispatch(
      login({ email: "test@example.com", password: "12345" })
    );

    expect(mockStore.getState().auth.user).toEqual(mockLoginResponse.data.user);
    expect(mockStore.getState().auth.token).toEqual(
      mockLoginResponse.data.access_token
    );
  });

  it("fetch user should initialise user", async () => {
    const mockStore = configureStore({
      reducer: {
        auth: authReducer,
      },
      middleware: (defaults) => {
        return defaults({
          thunk: {
            extraArgument: mockApi as AppAPI,
          },
        });
      },
    });

    await mockStore.dispatch(fetchUser());

    expect(mockStore.getState().auth.user).toEqual(mockLoginResponse.data.user);
  });

  it("logout clears auth state", async () => {
    const mockStore = configureStore({
      reducer: {
        auth: authReducer,
      },
      middleware: (defaults) => {
        return defaults({
          thunk: {
            extraArgument: mockApi as AppAPI,
          },
        });
      },
    });

    mockStore.dispatch(logout);

    expect(mockStore.getState().auth.user).toBeNull()
    expect(mockStore.getState().auth.token).toBeNull()
  });
});
