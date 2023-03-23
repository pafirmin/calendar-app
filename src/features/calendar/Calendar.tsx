import {
  Box,
  Card,
  CardContent,
  Divider,
  Modal,
  Typography,
} from "@mui/material";
import {
  addDays,
  eachDayOfInterval,
  format,
  getDay,
  getDaysInMonth,
  isToday,
  startOfMonth,
} from "date-fns";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import CalendarDay from "./CalendarDay";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchTasks } from "../tasks/tasks.slice";
import { tasksByDate } from "../tasks/utils";
import { Task } from "../tasks/interfaces";
import { styled } from "@mui/system";
import TaskModal from "./TaskModal";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const CalendarWrapper = styled(Box)(() => ({
  width: "100%",
  overflowX: "scroll",
  overflowY: "scroll",
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
}));

const CalendarGrid = styled(Box)(() => ({
  display: "grid",
  position: "relative",
  gridTemplateColumns: "repeat(7, 1fr)",
  gridTemplateRows: "40px repeat(auto-fit, minmax(0, 1fr))",
  gap: "2px",
  height: "100%",
  minWidth: "1200px",
  minHeight: 700,
  paddingBottom: 1,
}));

const CalendarHeader = styled("header")(({ theme }) => ({
  position: "sticky",
  top: 0,
  gridColumn: "span 7",
  color: "#fff",
  fontWeight: "bold",
  backgroundColor: theme.palette.primary.light,
  zIndex: 100,
}));

const Calendar = () => {
  const dispatch = useAppDispatch();
  const selectedFolders = useAppSelector(({ folders }) => folders.selected);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
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
  // First day in range
  const start = useMemo(() => addDays(baseDate, -offset), [baseDate, offset]);
  // Last day in range
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
        folder_id: selectedFolders,
      })
    );
  }, [start, end, selectedFolders, dispatch]);

  useEffect(() => {
    if (selectedFolders.length > 0) {
      handleFetchTasks();
    }
  }, [handleFetchTasks, selectedFolders.length]);

  return (
    <Fragment>
      <TaskModal
        open={Boolean(selectedTask)}
        selectedTask={selectedTask}
        onClose={() => setSelectedTask(null)}
        aria-labelledby="modal-task-title"
        aria-describedby="modal-task-description"
      />
      <CalendarWrapper>
        <CalendarGrid>
          <CalendarHeader>
            {DAYS.map((day) => (
              <Box
                key={day}
                component="span"
                sx={() => ({
                  padding: 1,
                  textAlign: "center",
                  display: "inline-block",
                  width: "calc(100% / 7)",
                })}
              >
                {day}
              </Box>
            ))}
          </CalendarHeader>
          {dateRange.map((date) => (
            <CalendarDay
              key={date.toISOString()}
              date={date}
              tasks={tasksMap[format(date, "yyy-MM-dd")]}
              isToday={isToday(date)}
              isCurrMonth={date.getMonth() === baseDate.getMonth()}
              handleClickTask={(task) => setSelectedTask(task)}
            />
          ))}
        </CalendarGrid>
      </CalendarWrapper>
    </Fragment>
  );
};

export default Calendar;
