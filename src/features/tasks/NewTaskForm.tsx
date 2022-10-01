import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import { CreateTaskDTO } from "./interfaces";

const validationSchema = Yup.object({
  title: Yup.string().required("Please enter a title for your task"),
  description: Yup.string().max(500),
  datetime: Yup.date(),
});

const NewTaskForm = () => {
  const initialValues: CreateTaskDTO = {
    title: "",
    description: "",
    datetime: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={() => {}}
      validationSchema={validationSchema}
      validateOnBlur
    >
      {(formik) => (
        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          <Typography gutterBottom variant="h3" textAlign="center">
            New Task
          </Typography>
          <Stack spacing={2}>
            <TextField
              name="title"
              label="Title"
              value={formik.values.title}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
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
            <Button type="submit">Create Task</Button>
          </Stack>
        </Box>
      )}
    </Formik>
  );
};

export default NewTaskForm;
