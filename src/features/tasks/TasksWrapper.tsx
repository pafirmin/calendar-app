import { ReactNode, useMemo } from "react";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { Box, Typography, Tooltip, IconButton } from "@mui/material";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { toggleDrawer } from "../layout/layout.slice";

interface Props {
  children: ReactNode;
}

const TasksWrapper = ({ children }: Props) => {
  const dispatch = useAppDispatch();
  const handleClick = () => {
    dispatch(toggleDrawer({ anchor: "right", open: true }));
  };
  const { selectedDate } = useAppSelector((state) => state.monthPicker);
  const displayDate = useMemo(
    () => format(new Date(selectedDate), "MMMM, yyyy"),
    [selectedDate]
  );

  return (
    <Box
      component="article"
      sx={{
        height: "100%",
        maxWidth: "100vw",
        marginLeft: { sm: 4 },
        marginRight: { md: 4 },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        component="header"
        sx={{
          flexGrow: 0,
          paddingTop: 1,
          left: 0,
          display: "flex",
          alignItems: "center",
          zIndex: 100,
        }}
      >
        <Typography variant="h2">{displayDate}</Typography>
        <Tooltip title="Add a new event">
          <IconButton aria-label="add a task" onClick={handleClick}>
            <NoteAddIcon color="secondary" />
          </IconButton>
        </Tooltip>
      </Box>
      {children}
    </Box>
  );
};

export default TasksWrapper;
