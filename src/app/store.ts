import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import folderReducer from "../features/folders/folders.slice";
import tasksReducer from "../features/tasks/tasks.slice";
import authReducer from "../features/auth/auth.slice";
import alertsReducer from "../features/alerts/alerts.slice";
import layoutReducer from "../features/layout/layout.slice";
import monthPickerReducer from "../features/month-picker/month-picker.slice";
import appApi from "./api";
import {catchAPIError, clearLocalStorage} from "../common/middleware";

export const store = configureStore({
  reducer: {
    folders: folderReducer,
    tasks: tasksReducer,
    auth: authReducer,
    alerts: alertsReducer,
    layout: layoutReducer,
    monthPicker: monthPickerReducer,
  },
  middleware: (defaults) => {
    return defaults({
      thunk: {
        extraArgument: appApi
      }
    }).concat(clearLocalStorage, catchAPIError)
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
