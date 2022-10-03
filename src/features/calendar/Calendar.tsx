import { Box, Typography } from "@mui/material";
import { endOfMonth, format, getDaysInMonth, setDate } from "date-fns";
import { range } from "../../common/utils";
import { useCallback, useMemo, useState } from "react";
import { useFetchTasks } from "../tasks/hooks";
import CalendarDay from "./CalendarDay";

const Calendar = () => {
  const today = useMemo(() => new Date(), []);
  const baseYear = today.getFullYear();
  const [month, setMonth] = useState(today.getMonth());
  const [tasks, filters] = useFetchTasks({
    min_date: today.toISOString(),
    max_date: endOfMonth(today).toISOString(),
  });

  const getCalendarDays = useCallback(() => {
    const baseDate = new Date(baseYear, month, 1);

    return range(1, getDaysInMonth(baseDate) + 1).map((day) => {
      const tasksOnDay = tasks[format(setDate(baseDate, day), "yyyy-MM-dd")];

      return <CalendarDay key={day} day={day} tasks={tasksOnDay || []} />;
    });
  }, [baseYear, month, tasks]);

  return (
    <Box
      component="article"
      sx={{
        marginLeft: { sm: 4 },
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
      </Box>
      <Box sx={{ height: "100%", overflowY: "scroll", marginTop: 1 }}>
        <Box
          sx={(theme) => ({
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            maxWidth: 1600,
            backgroundColor: theme.palette.primary.main,
            gap: "1px",
            padding: "1px",
          })}
        >
          {getCalendarDays()}
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;
