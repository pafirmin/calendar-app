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
      <Modal
        open={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        aria-labelledby="modal-task-title"
        aria-describedby="modal-task-description"
      >
        <Card
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(90vw, 600px)",
          }}
        >
          <CardContent>
            <Box
              component="header"
              display="flex"
              justifyContent="space-between"
              flexWrap="wrap"
            >
              <Typography id="modal-task-title" variant="h3">
                {selectedTask?.title}
              </Typography>
              {selectedTask && (
                <Typography component="time" color="text.secondary">
                  {format(
                    new Date(selectedTask.datetime),
                    "iiii, do MMMM, HH:mm"
                  )}
                </Typography>
              )}
            </Box>
            <Divider sx={{ marginTop: 1, marginBottom: 2 }} />
            <Typography id="modal-task-description">
              {selectedTask?.description
                ? selectedTask.description
                : "No description"}
            </Typography>
          </CardContent>
        </Card>
      </Modal>
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
          <Box
            component="header"
            sx={(theme) => ({
              position: "sticky",
              top: 0,
              gridColumn: "span 7",
              color: "#fff",
              fontWeight: "bold",
              backgroundColor: theme.palette.primary.light,
              zIndex: 100,
            })}
          >
            {DAYS.map((day) => (
              <Box
                key={day}
                component="span"
                sx={(theme) => ({
                  padding: 1,
                  textAlign: "center",
                  display: "inline-block",
                  width: "calc(100% / 7)",
                })}
              >
                {day}
              </Box>
            ))}
          </Box>
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
        </Box>
      </Box>
    </Fragment>
  );
};

export default Calendar;
