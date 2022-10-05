import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import {
  addDays,
  eachDayOfInterval,
  format,
  getDay,
  getDaysInMonth,
  isToday,
  startOfMonth,
} from "date-fns";
import { useMemo, useState } from "react";
import { useFetchTasks } from "../tasks/hooks";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import CalendarDay from "./CalendarDay";
import { toggleDrawer } from "../layout/layout.slice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const Calendar = () => {
  const dispatch = useAppDispatch();
  const { selectedDate } = useAppSelector((state) => state.monthPicker);
  const baseDate = useMemo(
    () => startOfMonth(new Date(selectedDate)),
    [selectedDate]
  );
  const daysInMonth = getDaysInMonth(baseDate);
  // Number of leading days to render
  const offset = getDay(baseDate);
  // Round to nearest multiple of 7 to get total no. days to render
  const remainder = (daysInMonth + offset) % 7;
  const totalDays = daysInMonth + offset + 7 - remainder;
  const start = addDays(baseDate, -offset);
  const end = addDays(start, totalDays - 1);
  const dateRange = useMemo(
    () => eachDayOfInterval({ start, end }),
    [end, start]
  );

  const [tasks, filters] = useFetchTasks({
    min_date: start.toISOString(),
    max_date: end.toISOString(),
  });

  const handleClick = () => {
    dispatch(toggleDrawer({ anchor: "right", open: true }));
  };

  return (
    <Box
      component="article"
      sx={{
        height: "100%",
        marginLeft: { sm: 4 },
        marginRight: { sm: 4 },
        display: "flex",
        flexDirection: "column",
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
        <Typography variant="h2">{format(baseDate, "MMMM, yyyy")}</Typography>
        <Tooltip title="Add a new event">
          <IconButton aria-label="add a task" onClick={handleClick}>
            <NoteAddIcon color="secondary" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box
        sx={{
          display: "grid",
          marginTop: 1,
          gridTemplateColumns: "repeat(7, 1fr)",
          gridTemplateRows: "40px repeat(auto-fit, minmax(0, 1fr))",
          gap: "2px",
          minWidth: "1200px",
          flexGrow: 1,
        }}
      >
        {DAYS.map((day) => (
          <Box
            key={day}
            sx={(theme) => ({
              padding: 1,
              color: "#fff",
              fontWeight: "bold",
              backgroundColor: theme.palette.primary.light,
            })}
          >
            {day}
          </Box>
        ))}
        {dateRange.map((date) => (
          <CalendarDay
            key={date.toISOString()}
            date={date}
            tasks={tasks[format(date, "yyy-MM-dd")]}
            isToday={isToday(date)}
            isCurrMonth={date.getMonth() === baseDate.getMonth()}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Calendar;
