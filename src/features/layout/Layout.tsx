import {
  AppBar,
  Box,
  Drawer,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import RequireAuth from "../auth/RequireAuth";
import FolderList from "../folders/FolderList";
import { fetchFolders } from "../folders/folders.slice";

const drawerWidth = 240;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(true);
  const toggleDrawer = () => setMobileOpen(!mobileOpen);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchFolders());
  }, [dispatch]);

  return (
    <RequireAuth>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h1" fontSize="3rem">
            GoToDo
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: "flex" }}>
        <Box
          component="aside"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {isMobile ? (
            <Drawer
              variant={isMobile ? "temporary" : "permanent"}
              open={mobileOpen}
              onClose={toggleDrawer}
              sx={{
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawerWidth,
                },
              }}
            >
              <FolderList />
            </Drawer>
          ) : (
            <Box>
              <FolderList />
            </Box>
          )}
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </RequireAuth>
  );
};

export default Layout;
