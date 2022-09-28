import {
  Box,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { createFolder, toggleSelected } from "./folders.slice";
import { ChangeEvent, FormEvent, useState } from "react";

const FolderList = () => {
  const dispatch = useAppDispatch();
  const { entities: folders, selected } = useAppSelector(
    (state) => state.folders
  );
  const [inputActive, setInputActive] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewFolderName(e.currentTarget.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(createFolder({ name: newFolderName })).unwrap();

      setNewFolderName("");
      setInputActive(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box sx={{ marginTop: 1 }}>
      <ListItem
        component="h2"
        sx={{ fontSize: "1.5rem", margin: 0, justifyContent: "space-between" }}
      >
        Your Folders
        <Tooltip title="Create new folder">
          <IconButton onClick={() => setInputActive(!inputActive)}>
            <CreateNewFolderIcon color="secondary" />
          </IconButton>
        </Tooltip>
      </ListItem>
      <List>
        {inputActive && (
          <ListItem>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                autoFocus
                label="Folder name"
                name="new-folder-name"
                value={newFolderName}
                onChange={handleChange}
              />
            </Box>
          </ListItem>
        )}
        {folders.map((folder) => (
          <MenuItem
            key={folder.id}
            sx={{ justifyContent: "space-between" }}
            selected={selected.includes(folder.id)}
            onClick={() => dispatch(toggleSelected(folder))}
          >
            <ListItemIcon>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText>{folder.name}</ListItemText>
            <Checkbox checked={selected.includes(folder.id)} />
          </MenuItem>
        ))}
      </List>
    </Box>
  );
};

export default FolderList;
