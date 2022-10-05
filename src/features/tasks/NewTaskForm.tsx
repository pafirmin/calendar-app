import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Formik } from "formik";
import { StatusCodes } from "http-status-codes";
import { useEffect, useRef } from "react";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ValidationFailedResponse } from "../../common/types";
import { showSuccess } from "../alerts/alerts.slice";
import { CreateTaskDTO } from "./interfaces";
import { createTask } from "./tasks.slice";

const validationSchema = Yup.object({
  title: Yup.string().required("Please enter a title for your task"),
  description: Yup.string().max(500),
  datetime: Yup.date().required(),
  folderId: Yup.number().required(),
});

type NewTaskFormValues = Omit<CreateTaskDTO, "datetime"> & {
  datetime: Date;
  folderId: number;
};

const NewTaskForm = () => {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const { newTaskDate } = useAppSelector((state) => state.tasks);
  const { entities: folders } = useAppSelector((state) => state.folders);
  const dispatch = useAppDispatch();
  const initialValues: NewTaskFormValues = {
    title: "",
    description: "",
    datetime: new Date(newTaskDate),
    folderId: folders[0].id,
  };

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [titleInputRef]);

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      validateOnChange
      validateOnBlur={false}
      onSubmit={async (values, { resetForm, setErrors }) => {
        const dto: CreateTaskDTO = {
          ...values,
          datetime: values.datetime.toISOString(),
        };

        try {
          await dispatch(
            createTask({
              folderId: values.folderId,
              body: dto,
            })
          ).unwrap();

          resetForm({
            values: {
              folderId: values.folderId,
              datetime: values.datetime,
              title: "",
              description: "",
            },
          });

          dispatch(showSuccess("Task created!"));
        } catch (err: any) {
          console.error(err);
          switch (err.status) {
            case StatusCodes.UNPROCESSABLE_ENTITY:
              setErrors(
                (err as ValidationFailedResponse<CreateTaskDTO>).fields
              );
              break;
            default:
              break;
          }
        }
      }}
    >
      {(formik) => (
        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          <Stack spacing={4}>
            <Typography variant="h2" textAlign="center">
              Create a new task
            </Typography>
            <TextField
              required
              name="title"
              label="Title"
              value={formik.values.title}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              inputRef={titleInputRef}
            />
            <TextField
              multiline
              rows={5}
              name="description"
              label="Description"
              value={formik.values.description}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            />
            <TextField
              select
              name="folderId"
              label="Folder"
              value={formik.values.folderId}
              onChange={formik.handleChange}
            >
              {folders.map((folder) => (
                <MenuItem key={folder.id} value={folder.id}>
                  {folder.name}
                </MenuItem>
              ))}
            </TextField>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                renderInput={(props) => (
                  <TextField
                    name="datetime"
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.datetime && Boolean(formik.errors.datetime)
                    }
                    helperText={
                      formik.errors.datetime && "Please enter a valid date"
                    }
                    {...props}
                  />
                )}
                inputFormat="dd/MM/yyyy HH:mm"
                label="When?"
                value={formik.values.datetime}
                onChange={(val) => formik.setFieldValue("datetime", val)}
              />
            </LocalizationProvider>
            <Button
              type="submit"
              variant="outlined"
              disabled={formik.isSubmitting}
            >
              Create Task
            </Button>
          </Stack>
        </Box>
      )}
    </Formik>
  );
};

export default NewTaskForm;
