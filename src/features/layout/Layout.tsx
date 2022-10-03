import {
  AppBar,
  Box,
  Drawer,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import RequireAuth from "../auth/RequireAuth";
import FolderList from "../folders/FolderList";
import { fetchFolders } from "../folders/folders.slice";
import NewTaskForm from "../tasks/NewTaskForm";
import { toggleDrawer } from "./layout.slice";

const folderMenuWidth = 300;
const taskMenuWidth = 430;

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useAppDispatch();
  const { drawers } = useAppSelector((state) => state.layout);

  useEffect(() => {
    dispatch(fetchFolders({ sort: "name" }));
  }, [dispatch]);

  return (
    <RequireAuth>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h1" fontSize="3rem">
              GoToDo
            </Typography>
            <button
              onClick={() =>
                dispatch(toggleDrawer({ anchor: "left", open: true }))
              }
            >
              open
            </button>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            display: "flex",
            overflowY: "hidden",
          }}
        >
          <Box
            component="aside"
            sx={{
              width: { md: folderMenuWidth },
              flexShrink: { md: 0 },
              height: "100%",
            }}
          >
            {isMobile ? (
              <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                open={drawers.left}
                onClose={() =>
                  dispatch(toggleDrawer({ anchor: "left", open: false }))
                }
                sx={{
                  "& .MuiDrawer-paper": {
                    boxSizing: "border-box",
                    width: folderMenuWidth,
                  },
                }}
              >
                <FolderList />
              </Drawer>
            ) : (
              <FolderList />
            )}
          </Box>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width: { md: `calc(100% - ${folderMenuWidth}px)` },
            }}
          >
            <Outlet />
          </Box>
          <Box component="aside" sx={{ flexShrink: 0 }}>
            <Drawer
              variant="temporary"
              open={drawers.right}
              anchor="right"
              onClose={() =>
                dispatch(toggleDrawer({ anchor: "right", open: false }))
              }
              sx={{
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: taskMenuWidth,
                  maxWidth: "100vw",
                  padding: 4,
                },
              }}
            >
              <NewTaskForm />
            </Drawer>
          </Box>
        </Box>
        <div />
      </Box>
    </RequireAuth>
  );
};

export default Layout;
