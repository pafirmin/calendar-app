import { ThemeProvider } from "@mui/material";
import { createTheme, CssBaseline } from "@mui/material";
import { useMemo } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAppSelector } from "./app/hooks";
import Agenda from "./features/agenda/Agenda";
import Alerts from "./features/alerts/Alerts";
import Login from "./features/auth/Login";
import Calendar from "./features/calendar/Calendar";
import Layout from "./features/layout/Layout";
import getTheme from "./theme";

function App() {
  const { theme } = useAppSelector((state) => state.layout);
  const currentTheme = useMemo(() => createTheme(getTheme(theme)), [theme]);

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Alerts />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Calendar />} />
            <Route path="/agenda" element={<Agenda />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
