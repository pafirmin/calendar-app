import { Menu } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  Fab,
  SwipeableDrawer,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Fragment, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout } from "../auth/auth.slice";
import RequireAuth from "../auth/RequireAuth";
import FolderList from "../folders/FolderList";
import MonthPicker from "../month-picker/MonthPicker";
import NewTaskForm from "../tasks/NewTaskForm";
import TasksWrapper from "../tasks/TasksWrapper";
import { toggleDrawer } from "./layout.slice";

const LEFT_DRAWER_WIDTH = 340;
const RIGHT_DRAWER_WIDTH = 430;
const APP_BAR_HEIGHT = 64;

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useAppDispatch();
  const first_name = useAppSelector((state) => state.auth.user?.first_name);
  const { drawers } = useAppSelector((state) => state.layout);
  const navigate = useNavigate();
  const didRenderRef = useRef(false);

  // On initial render, redirect to agenda view if on small screen
  useEffect(() => {
    if (isMobile && !didRenderRef.current) {
      navigate("/agenda");
    }

    didRenderRef.current = true;
  }, [isMobile, didRenderRef, navigate]);

  return (
    <RequireAuth>
      <AppBar
        position="fixed"
        sx={(theme) => ({
          height: APP_BAR_HEIGHT,
          zIndex: theme.zIndex.drawer + 1,
        })}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h1" fontSize="3rem">
            GoToDo
          </Typography>
          <Button sx={{ color: "#fff" }} onClick={() => dispatch(logout())}>
            Logout {first_name}
          </Button>
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
            width: { md: LEFT_DRAWER_WIDTH },
            flexShrink: { md: 0 },
            height: "100%",
          }}
        >
          <SwipeableDrawer
            variant={isMobile ? "temporary" : "permanent"}
            open={drawers.left}
            onClose={() =>
              dispatch(toggleDrawer({ anchor: "left", open: false }))
            }
            onOpen={() =>
              dispatch(toggleDrawer({ anchor: "left", open: true }))
            }
            sx={{
              "& .MuiDrawer-paper": {
                marginTop: `${APP_BAR_HEIGHT}px`,
                boxSizing: "border-box",
                width: LEFT_DRAWER_WIDTH,
              },
            }}
          >
            <Fragment>
              <MonthPicker />
              <Divider />
              <FolderList />
            </Fragment>
          </SwipeableDrawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            marginTop: `${APP_BAR_HEIGHT}px`,
            height: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
            width: { md: `calc(100% - ${LEFT_DRAWER_WIDTH}px)` },
          }}
        >
          <TasksWrapper>
            <Outlet />
          </TasksWrapper>
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
                marginTop: `${APP_BAR_HEIGHT}px`,
                width: RIGHT_DRAWER_WIDTH,
                maxWidth: "100vw",
                padding: 4,
              },
            }}
          >
            <NewTaskForm />
          </Drawer>
        </Box>
      </Box>
      {isMobile && (
        <Fab
          onClick={() => dispatch(toggleDrawer({ anchor: "left", open: true }))}
          color="primary"
          sx={{ position: "fixed", bottom: 40, right: 40 }}
        >
          <Menu />
        </Fab>
      )}
    </RequireAuth>
  );
};

export default Layout;
