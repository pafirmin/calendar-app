import {
  Modal,
  Card,
  CardContent,
  Box,
  Typography,
  Divider,
  ModalProps,
  styled,
} from "@mui/material";
import format from "date-fns/format";
import { Task } from "../tasks/interfaces";

const TaskCard = styled(Card)(() => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(90vw, 600px)",
}));

interface Props extends Omit<ModalProps, "children"> {
  selectedTask: Task | null;
}

const TaskModal = ({ selectedTask, ...modalProps }: Props) => {
  return (
    <Modal
      aria-labelledby="modal-task-title"
      aria-describedby="modal-task-description"
      {...modalProps}
    >
      <TaskCard>
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
      </TaskCard>
    </Modal>
  );
};

export default TaskModal;
