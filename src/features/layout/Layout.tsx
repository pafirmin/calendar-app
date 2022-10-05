import {
  AppBar,
  Box,
  Divider,
  Drawer,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Fragment, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import RequireAuth from "../auth/RequireAuth";
import FolderList from "../folders/FolderList";
import { fetchFolders } from "../folders/folders.slice";
import MonthPicker from "../month-picker/MonthPicker";
import NewTaskForm from "../tasks/NewTaskForm";
import { toggleDrawer } from "./layout.slice";

const folderMenuWidth = 340;
const taskMenuWidth = 430;
const appBarHeight = 64;

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
      <AppBar
        position="fixed"
        sx={(theme) => ({
          height: appBarHeight,
          zIndex: theme.zIndex.drawer + 1,
        })}
      >
        <Toolbar>
          <Typography variant="h1" fontSize="3rem">
            GoToDo
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: "flex",
          overflowY: "hidden",
          flexGrow: 1,
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
          <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            open={drawers.left}
            onClose={() =>
              dispatch(toggleDrawer({ anchor: "left", open: false }))
            }
            sx={{
              "& .MuiDrawer-paper": {
                marginTop: `${appBarHeight}px`,
                boxSizing: "border-box",
                width: folderMenuWidth,
              },
            }}
          >
            <Fragment>
              <MonthPicker />
              <Divider />
              <FolderList />
            </Fragment>
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            marginTop: `${appBarHeight}px`,
            height: `calc(100vh - ${appBarHeight}px)`,
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
    </RequireAuth>
  );
};

export default Layout;
