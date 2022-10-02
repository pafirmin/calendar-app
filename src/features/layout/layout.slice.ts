import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {LayoutState} from "./interfaces";

const initialState: LayoutState = {
  drawers: {
    left: true,
    right: false,
  },
  theme: "light"
};

export type drawerAnchor = "right" | "left";

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    toggleDrawer: (
      state,
      { payload }: PayloadAction<{ anchor: drawerAnchor; open: boolean }>
    ) => {
      state.drawers[payload.anchor] = payload.open;
    },
    switchTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    }
  },
});

export const { toggleDrawer } = layoutSlice.actions;

export default layoutSlice.reducer;
