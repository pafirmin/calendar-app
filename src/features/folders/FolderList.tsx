import {
  Box,
  IconButton,
  List,
  ListItem,
  Tooltip,
  Typography,
} from "@mui/material";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import CancelIcon from "@mui/icons-material/Cancel";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { toggleSelected } from "./folders.slice";
import { Fragment, useState } from "react";
import NewFolderForm from "./NewFolderForm";
import FolderListItem from "./FolderListItem";

const FolderList = () => {
  const dispatch = useAppDispatch();
  const { entities: folders, selected } = useAppSelector(
    (state) => state.folders
  );
  const [inputActive, setInputActive] = useState(false);

  const handleToggleInput = () => setInputActive(!inputActive);

  return (
    <Fragment>
      <Box
        component="header"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: 2,
          paddingRight: 2,
          paddingTop: 1,
        }}
      >
        <Typography variant="h2" sx={{ marginBottom: 0 }}>
          Your folders
        </Typography>
        {inputActive ? (
          <Tooltip title="Cancel">
            <IconButton
              aria-label="cancel create folder"
              onClick={handleToggleInput}
            >
              <CancelIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Create new folder">
            <IconButton
              aria-label="Create new folder"
              onClick={handleToggleInput}
            >
              <CreateNewFolderIcon color="secondary" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <List sx={{ height: "100%", overflowY: "scroll" }}>
        {inputActive && (
          <ListItem>
            <NewFolderForm />
          </ListItem>
        )}
        {folders.map((folder) => (
          <FolderListItem
            key={folder.id}
            folder={folder}
            selected={selected.includes(folder.id)}
            handleClick={() => dispatch(toggleSelected(folder))}
          />
        ))}
      </List>
    </Fragment>
  );
};

export default FolderList;
