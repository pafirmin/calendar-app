import {
  MenuItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  IconButton,
  Menu,
  Box,
  TextField,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import { Folder, UpdateFolderDTO } from "./interfaces";
import { Fragment, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { deleteFolder, updateFolder } from "./folders.slice";
import { Formik } from "formik";
import { StatusCodes } from "http-status-codes";
import { ValidationFailedResponse } from "../../common/types";
import * as Yup from "yup";

interface Props {
  folder: Folder;
  selected: boolean;
  handleClick: () => void;
}

const validationSchema = Yup.object({
  name: Yup.string().required(),
});

const FolderListItem = ({ folder, selected, handleClick }: Props) => {
  const [editing, setEditing] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const dispatch = useAppDispatch();
  const initialValues: UpdateFolderDTO = {
    name: folder.name,
  };

  const updateForm = (
    <Formik
      validationSchema={validationSchema}
      validateOnBlur={false}
      initialValues={initialValues}
      onSubmit={async (values, { resetForm, setErrors }) => {
        try {
          await dispatch(
            updateFolder({ id: folder.id, body: values })
          ).unwrap();

          resetForm({ values: { name: folder.name } });
          setAnchorEl(null);
          setEditing(false);
        } catch (err: any) {
          console.error(err);
          switch (err.status) {
            case StatusCodes.UNPROCESSABLE_ENTITY:
              setErrors(
                (err as ValidationFailedResponse<UpdateFolderDTO>).fields
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

  return (
    <Fragment>
      <MenuItem
        key={folder.id}
        sx={{ justifyContent: "space-between" }}
        selected={selected}
        onClick={handleClick}
      >
        <ListItemIcon>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setAnchorEl(e.currentTarget);
            }}
          >
            <FolderIcon />
          </IconButton>
        </ListItemIcon>
        <Fragment>
          <ListItemText>{folder.name}</ListItemText>
          <Checkbox checked={selected} />
        </Fragment>
      </MenuItem>
      <Menu
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
      >
        <MenuItem onClick={() => setEditing(true)}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => dispatch(deleteFolder(folder.id))}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

export default FolderListItem;
