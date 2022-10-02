import { PaletteMode, PaletteOptions } from "@mui/material";

const lightPalette: PaletteOptions = {
  mode: "light",
  background: {
    default: "#f8f8f8",
  },
  primary: {
    main: "#00796B",
    light: "#26A69A",
    dark: "#00695C",
  },
};

const darkPalette: PaletteOptions = {
  mode: "dark",
};

const getTheme = (mode: PaletteMode = "light") => ({
  palette: mode === "light" ? lightPalette : darkPalette,
  typography: {
    fontFamily: ["Arial", "Roboto", "Arial"].join(","),

    h1: {
      fontSize: 34,
    },
    h2: {
      fontSize: 24,
    },
    h3: {
      fontSize: 20,
    },
    h4: {
      fontSize: 18,
    },
    h5: {
      fontSize: 16,
    },
    h6: {
      fontSize: 14,
    },
  },
});

export default getTheme;
