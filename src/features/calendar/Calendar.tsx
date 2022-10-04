import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import {
  addDays,
  eachDayOfInterval,
  format,
  getDay,
  getDaysInMonth,
  startOfMonth,
} from "date-fns";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { useFetchTasks } from "../tasks/hooks";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import CalendarDay from "./CalendarDay";
import { toggleDrawer } from "../layout/layout.slice";
import { useAppDispatch } from "../../app/hooks";

const Calendar = () => {
  const dispatch = useAppDispatch();
  const today = useMemo(() => new Date(), []);
  const [month, setMonth] = useState(today.getMonth());
  const baseDate = useMemo(
    () => startOfMonth(new Date(today.getFullYear(), month, 1)),
    [today, month]
  );
  const daysInMonth = getDaysInMonth(baseDate);
  // Number of leading days to render
  const offset = getDay(baseDate);
  // Round to nearest multiple of 7 to get total no. days to render
  const remainder = (daysInMonth + offset) % 7;
  const totalDays = daysInMonth + offset + 7 - remainder;
  const start = addDays(baseDate, -offset);
  const end = addDays(start, totalDays - 1);
  const [tasks, filters] = useFetchTasks({
    min_date: start.toISOString(),
    max_date: end.toISOString(),
  });

  const handleClick = () => {
    dispatch(toggleDrawer({ anchor: "right", open: true }));
  };

  const getCalendarDays = useCallback(
    (): ReactNode[] =>
      eachDayOfInterval({ start, end }).map((date) => (
        <CalendarDay
          blank={date.getMonth() !== baseDate.getMonth()}
          key={date.toISOString()}
          day={date.getDate()}
          tasks={tasks[format(date, "yyy-MM-dd")]}
        />
      )),
    [baseDate, end, start, tasks]
  );

  return (
    <Box
      component="article"
      sx={{
        marginLeft: { sm: 4 },
        marginRight: { sm: 4 },
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box
        component="header"
        sx={{
          paddingTop: 1,
          display: "flex",
          alignItems: "center",
          zIndex: 100,
        }}
      >
        <Typography variant="h2">Your calendar</Typography>
        <Tooltip title="Add a new event">
          <IconButton onClick={handleClick}>
            <NoteAddIcon color="secondary" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "2px",
          height: "100%",
          flexGrow: 1,
        }}
      >
        {getCalendarDays()}
      </Box>
    </Box>
  );
};

export default Calendar;
