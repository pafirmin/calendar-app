import { isRejectedWithValue, Middleware } from "@reduxjs/toolkit";
import { StatusCodes } from "http-status-codes";
import { showError, unexpectedError } from "../features/alerts/alerts.slice";
import { login, logout } from "../features/auth/auth.slice";

export const catchAPIError: Middleware = (store) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    switch (action.payload.status) {
      case StatusCodes.UNAUTHORIZED:
        if (login.rejected.match(action)) {
          store.dispatch(showError("Incorrect credentials. Please try again."));
          break;
        }
        localStorage.clear();
        store.dispatch(logout());
        store.dispatch(
          showError("You have been logged out. Please log back in")
        );
        break;
      case StatusCodes.UNPROCESSABLE_ENTITY:
        store.dispatch(showError("Validation failed"));
        break;
      case StatusCodes.FORBIDDEN:
        store.dispatch(
          showError(
            "You do not have permission to access the requested resource"
          )
        );
        break;
      default:
        store.dispatch(unexpectedError());
    }
  }

  return next(action);
};
