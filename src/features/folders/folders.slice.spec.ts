import { CreateFolderDTO, Folder, UpdateFolderDTO } from "./interfaces";
import folderReducer, {
  createFolder,
  deleteFolder,
  fetchFolders,
  updateFolder,
} from "./folders.slice";
import { configureStore } from "@reduxjs/toolkit";
import { APIMetaData } from "../../common/interfaces";
import { AppAPI } from "../../app/api";

describe("folder slice", () => {
  const mockFolders: Folder[] = [
    {
      id: 1,
      name: "Folder 1",
      created: "2022-12-12",
      updated: "2022-12-12",
      user_id: 1,
    },
    {
      id: 2,
      name: "Folder 2",
      created: "2022-12-12",
      updated: "2022-12-12",
      user_id: 1,
    },
    {
      id: 3,
      name: "Folder 3",
      created: "2022-12-12",
      updated: "2022-12-12",
      user_id: 1,
    },
  ];

  const mockFetchRes: { data: { metadata: APIMetaData; folders: Folder[] } } = {
    data: {
      metadata: {
        current_page: 1,
        first_page: 1,
        last_page: 1,
        total_records: 3,
        page_size: 10,
      },
      folders: mockFolders,
    },
  };

  const mockApi = {
    folders: {
      fetchFolders: () => new Promise((resolve) => resolve(mockFetchRes)),
      createFolder: (dto: CreateFolderDTO) =>
        new Promise((resolve) =>
          resolve({
            data: {
              folder: {
                ...dto,
                id: 6,
                created: "2022-12-12",
                updated: "2022-12-12",
                user_id: 1,
              },
            },
          })
        ),
      updateFolder: (id: number, dto: UpdateFolderDTO) =>
        new Promise((resolve) =>
          resolve({
            data: {
              folder: {
                ...dto,
                id,
                created: "2022-12-12",
                updated: "2022-12-12",
                user_id: 1,
              },
            },
          })
        ),
      deleteFolder: (id: number) => new Promise((resolve) => resolve(id)),
    },
  };

  const mockStore = configureStore({
    reducer: {
      folders: folderReducer,
    },
    middleware: (defaults) => {
      return defaults({
        thunk: {
          extraArgument: mockApi as AppAPI,
        },
      });
    },
  });

  it("should handle initialising folders", async () => {
    await mockStore.dispatch(fetchFolders());

    expect(mockStore.getState().folders.entities).toEqual(
      mockFetchRes.data.folders
    );
  });

  it("should handle creating a folder", async () => {
    await mockStore.dispatch(createFolder({ name: "New Folder" }));
    const expected: Folder = {
      id: 6,
      name: "New Folder",
      created: "2022-12-12",
      updated: "2022-12-12",
      user_id: 1,
    };

    expect(mockStore.getState().folders.entities).toContainEqual(expected);
  });

  it("should handle updating a folder", async () => {
    await mockStore.dispatch(
      updateFolder({ body: { name: "Updated" }, id: mockFolders[0].id })
    );
    const expected: Folder = {
      ...mockFolders[0],
      name: "Updated",
    };

    expect(mockStore.getState().folders.entities).toContainEqual(expected);
  });

  it("should handle deleting a folder", async () => {
    await mockStore.dispatch(deleteFolder(mockFolders[2].id));

    expect(mockStore.getState().folders.entities).not.toContainEqual(
      mockFolders[2]
    );
  });
});
