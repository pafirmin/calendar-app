import { List, MenuItem } from "@mui/material";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchFolders, toggleSelected } from "./folders.slice";

const FolderList = () => {
  const dispatch = useAppDispatch();
  const { entities: folders, selected } = useAppSelector(
    (state) => state.folders
  );

  useEffect(() => {
    dispatch(fetchFolders());
  }, [dispatch]);

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
