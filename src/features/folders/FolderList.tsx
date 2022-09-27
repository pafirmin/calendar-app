import { List, MenuItem } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { toggleSelected } from "./folders.slice";

const FolderList = () => {
  const dispatch = useAppDispatch();
  const { entities: folders, selected } = useAppSelector(
    (state) => state.folders
  );

  return (
    <List>
      {folders.map((folder) => (
        <MenuItem
          key={folder.id}
          selected={selected.includes(folder.id)}
          onClick={() => dispatch(toggleSelected(folder))}
        >
          {folder.name}
        </MenuItem>
      ))}
    </List>
  );
};

export default FolderList;
