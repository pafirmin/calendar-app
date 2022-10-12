import { Box, Paper, Typography } from "@mui/material";
import { format } from "date-fns";
import { truncate } from "lodash";
import { useState } from "react";
import { Task } from "../tasks/interfaces";

interface Props {
  task: Task;
}

const AgendaItem = ({ task }: Props) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box
      sx={{
        maxWidth: 500,
        display: "flex",
        alignItems: "center",
        flexGrow: 1,
        gap: 1,
        cursor: "pointer",
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <Typography
        component="time"
        sx={(theme) => ({ color: theme.palette.text.secondary })}
      >
        {format(new Date(task.datetime), "HH:mm")}{" "}
      </Typography>
      <Paper
        key={task.id}
        sx={{
          padding: 2,
          width: "100%",
        }}
      >
        <Typography variant="h4">{task.title}</Typography>
        <Typography
          sx={(theme) => ({
            color: theme.palette.text.secondary,
            position: "relative",
          })}
        >
          {expanded
            ? task.description
            : truncate(task.description, { length: 60 })}
        </Typography>
      </Paper>
    </Box>
  );
};

export default AgendaItem;
