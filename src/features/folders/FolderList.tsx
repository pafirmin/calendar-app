import { List, MenuItem } from "@mui/material";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchFolders, setActiveFolder } from "./folders.slice";

const FolderList = () => {
  const dispatch = useAppDispatch();
  const { folders, activeFolderId } = useAppSelector(({ folders }) => folders);

  useEffect(() => {
    dispatch(fetchFolders());
  }, [dispatch]);

  return (
    <List>
      {folders.map((folder) => (
        <MenuItem
          key={folder.id}
          selected={folder.id === activeFolderId}
          onClick={() => dispatch(setActiveFolder(folder.id))}
        >
          {folder.name}
        </MenuItem>
      ))}
    </List>
  );
};

export default FolderList;
