import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  drawers: {
    left: true,
    right: false,
  },
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
  },
});

export const { toggleDrawer } = layoutSlice.actions;

export default layoutSlice.reducer;
