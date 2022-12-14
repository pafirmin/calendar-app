import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum Severity {
  SUCCESS = "success",
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
}

export interface Alert {
  severity: Severity;
  message: string;
}

const initialState: Alert[] = [];

export const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    showSuccess: (state, action: PayloadAction<string>) => {
      state.push({ severity: Severity.SUCCESS, message: action.payload });
    },
    showInfo: (state, action: PayloadAction<string>) => {
      state.push({ severity: Severity.INFO, message: action.payload });
    },
    showWarning: (state, action: PayloadAction<string>) => {
      state.push({ severity: Severity.WARNING, message: action.payload });
    },
    showError: (state, action: PayloadAction<string>) => {
      state.push({ severity: Severity.ERROR, message: action.payload });
    },
    unexpectedError: (state) => {
      state.push({
        severity: Severity.ERROR,
        message:
          "Sorry, we could not process your request. Please try again later",
      });
    },
    shiftAlert: (state) => {
      return state.slice(1);
    },
  },
});

export const {
  showSuccess,
  showInfo,
  showError,
  showWarning,
  unexpectedError,
  shiftAlert,
} = alertsSlice.actions;

export default alertsSlice.reducer;
