import { Action, Middleware } from "@reduxjs/toolkit";
import { logout } from "../features/auth/auth.slice";

export const persistAuth: Middleware =
  (store) =>
  (next) =>
  <A extends Action>(action: A) => {
    const result = next(action);

    if (action.type?.startsWith("auth/")) {
      const state = store.getState().auth;
      localStorage.setItem("authState", state);
    }

    return result;
  };

export const catchAuthFailure: Middleware =
  (store) =>
  (next) =>
  <A extends Action>(action: A) => {
    try {
      return next(action);
    } catch (err: any) {
      switch (err.status) {
        case 401:
          store.dispatch(logout);
          break;
        default:
          throw err;
      }
    }
  };
