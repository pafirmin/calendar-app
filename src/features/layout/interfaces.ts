import {PaletteMode} from "@mui/material";

export interface LayoutState {
  drawers: {
    right: boolean,
    left: boolean,
  },
  theme: PaletteMode,
}
