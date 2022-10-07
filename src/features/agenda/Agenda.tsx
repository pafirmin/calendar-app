import { useCallback, useEffect, useMemo } from "react";
import { List, ListItem, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchTasks } from "../tasks/tasks.slice";
import { tasksByDate } from "../tasks/utils";
import AgendaItem from "./AgendaItem";

const Agenda = () => {
  const dispatch = useAppDispatch();
  const { selectedDate } = useAppSelector((state) => state.monthPicker);
  const selected = useAppSelector(({ folders }) => folders.selected);
  const { entities: tasks, loading } = useAppSelector(({ tasks }) => tasks);

  const tasksMap = useMemo(() => tasksByDate(tasks), [tasks]);

  const handleFetchTasks = useCallback(async () => {
    if (selected.length > 0) {
      dispatch(
        fetchTasks({
          min_date: format(startOfMonth(new Date(selectedDate)), "yyyy-MM-dd"),
          max_date: format(endOfMonth(new Date(selectedDate)), "yyyy-MM-dd"),
          folder_id: selected,
        })
      );
    }
  }, [selectedDate, selected, dispatch]);

  useEffect(() => {
    handleFetchTasks();
  }, [handleFetchTasks]);

  if (!loading && !tasks.length) {
    return (
      <Typography
        align="center"
        marginTop={4}
        fontSize="1.5rem"
        color="text.secondary"
      >
        Nothing planned... Yet!
      </Typography>
    );
  }

  return (
    <List
      sx={{
        height: "100%",
        overflowY: "scroll",
        paddingBottom: 4,
        paddingLeft: 2,
        paddingRight: 2,
      }}
      component="ol"
    >
      {Object.keys(tasksMap)
        .sort()
        .map((date) => (
          <Box key={date} component="li" sx={{ marginBottom: 2 }}>
            <Typography variant="h3" sx={{ marginLeft: 6 }}>
              <time>{format(new Date(date), "do MMMM, yyyy")}</time>
            </Typography>
            <List component="ol">
              {tasksMap[date].map((task) => (
                <ListItem key={task.id} disableGutters>
                  <AgendaItem task={task} />
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
    </List>
  );
};

export default Agenda;
