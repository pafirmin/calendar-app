import { ThemeProvider } from "@emotion/react";
import { createTheme, CssBaseline } from "@mui/material";
import { useMemo } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAppSelector } from "./app/hooks";
import Alerts from "./features/alerts/Alerts";
import Login from "./features/auth/Login";
import Layout from "./features/layout/Layout";
import TasksList from "./features/tasks/TasksList";
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
            <Route index element={<TasksList />} />
            <Route path="/calendar" element={<TasksList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
