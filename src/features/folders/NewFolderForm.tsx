import { Formik } from "formik";
import { StatusCodes } from "http-status-codes";
import { useAppDispatch } from "../../app/hooks";
import { ValidationFailedResponse } from "../../common/types";
import { createFolder } from "./folders.slice";
import { CreateFolderDTO } from "./interfaces";
import * as Yup from "yup";
import { Box, TextField } from "@mui/material";

const validationSchema = Yup.object({
  name: Yup.string().required(),
});

const NewFolderForm = () => {
  const dispatch = useAppDispatch();
  const initialValues: CreateFolderDTO = {
    name: "",
  };

  return (
    <Formik
      validationSchema={validationSchema}
      validateOnBlur={false}
      initialValues={initialValues}
      onSubmit={async (values, { resetForm, setErrors }) => {
        try {
          await dispatch(createFolder(values)).unwrap();

          resetForm();
        } catch (err: any) {
          console.error(err);
          switch (err.status) {
            case StatusCodes.UNPROCESSABLE_ENTITY:
              setErrors(
                (err as ValidationFailedResponse<CreateFolderDTO>).fields
              );
              break;
            default:
              break;
          }
        }
      }}
    >
      {(formik) => (
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{ width: "100%" }}
        >
          <TextField
            fullWidth
            autoFocus
            name="name"
            label="Folder name"
            value={formik.values.name}
            onChange={formik.handleChange}
            helperText={formik.touched.name && formik.errors.name}
            error={formik.touched.name && Boolean(formik.errors.name)}
          />
        </Box>
      )}
    </Formik>
  );
};

export default NewFolderForm;
