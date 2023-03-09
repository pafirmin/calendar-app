import {
  MenuItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import { Folder } from "./interfaces";
import { Fragment } from "react";

interface Props {
  folder: Folder;
  selected: boolean;
  handleClick: () => void;
}

const FolderListItem = ({ folder, selected, handleClick }: Props) => {
  return (
    <MenuItem
      key={folder.id}
      sx={{ justifyContent: "space-between" }}
      selected={selected}
      onClick={handleClick}
    >
      <ListItemIcon>
        <FolderIcon />
      </ListItemIcon>
      <Fragment>
        <ListItemText>{folder.name}</ListItemText>
        <Checkbox checked={selected} />
      </Fragment>
    </MenuItem>
  );
};

export default FolderListItem;
