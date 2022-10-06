import { Box } from "@mui/material";
import {
  addDays,
  eachDayOfInterval,
  format,
  getDay,
  getDaysInMonth,
  isToday,
  startOfMonth,
} from "date-fns";
import { useCallback, useEffect, useMemo } from "react";
import CalendarDay from "./CalendarDay";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchTasks } from "../tasks/tasks.slice";
import { tasksByDate } from "../tasks/utils";

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
  const selected = useAppSelector(({ folders }) => folders.selected);
  const selectedDate = useAppSelector(
    ({ monthPicker }) => monthPicker.selectedDate
  );
  const tasks = useAppSelector(({ tasks }) => tasks.entities);

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
  const start = useMemo(() => addDays(baseDate, -offset), [baseDate, offset]);
  const end = useMemo(() => addDays(start, totalDays - 1), [start, totalDays]);
  const dateRange = useMemo(
    () => eachDayOfInterval({ start, end }),
    [end, start]
  );

  const tasksMap = useMemo(() => tasksByDate(tasks), [tasks]);

  const handleFetchTasks = useCallback(async () => {
    dispatch(
      fetchTasks({
        min_date: format(start, "yyyy-MM-dd"),
        max_date: format(end, "yyyy-MM-dd"),
        folder_id: selected,
      })
    );
  }, [start, end, selected, dispatch]);

  useEffect(() => {
    if (selected.length > 0) {
      handleFetchTasks();
    }
  }, [handleFetchTasks, selected.length]);

  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "scroll",
        overflowY: "scroll",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
    >
      <Box
        sx={{
          display: "grid",
          position: "relative",
          gridTemplateColumns: "repeat(7, 1fr)",
          gridTemplateRows: "40px repeat(auto-fit, minmax(0, 1fr))",
          gap: "2px",
          height: "100%",
          minWidth: "1200px",
          minHeight: 900,
          paddingBottom: 1,
        }}
      >
        {DAYS.map((day) => (
          <Box
            key={day}
            sx={(theme) => ({
              position: "sticky",
              top: 0,
              padding: 1,
              color: "#fff",
              fontWeight: "bold",
              backgroundColor: theme.palette.primary.light,
              zIndex: 100,
            })}
          >
            {day}
          </Box>
        ))}
        {dateRange.map((date) => (
          <CalendarDay
            key={date.toISOString()}
            date={date}
            tasks={tasksMap[format(date, "yyy-MM-dd")]}
            isToday={isToday(date)}
            isCurrMonth={date.getMonth() === baseDate.getMonth()}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Calendar;
