import { configureStore } from "@reduxjs/toolkit";
import tasksReducer, {
  createTask,
  deleteTask,
  fetchTasks,
  updateTask,
} from "./tasks.slice";
import folderReducer from '../folders/folders.slice'
import { APIMetaData } from "../../common/interfaces";
import { TaskStatus } from "./enums";
import { CreateTaskDTO, Task, TaskFilter, UpdateTaskDTO } from "./interfaces";
import { AppAPI } from "../../app/api";

describe("tasks slice", () => {
  const mockTasks: Task[] = [
    {
      id: 1,
      title: "Test task 1",
      description: "Test task description",
      status: TaskStatus.DEFAULT,
      datetime: "2022-12-12",
      created: "2022-12-12",
      updated: "2022-12-12",
      folder_id: 1,
    },
    {
      id: 2,
      title: "Test task 2",
      description: "Test task description",
      status: TaskStatus.DEFAULT,
      datetime: "2022-12-12",
      created: "2022-12-12",
      updated: "2022-12-12",
      folder_id: 1,
    },
    {
      id: 3,
      title: "Test task 3",
      description: "Test task description",
      status: TaskStatus.DEFAULT,
      datetime: "2022-12-12",
      created: "2022-12-12",
      updated: "2022-12-12",
      folder_id: 1,
    },
  ];

    const mockNewTask: Task = {
      id: 4,
      title: "New task",
      description: "",
      status: TaskStatus.DEFAULT,
      datetime: "2022-12-12",
      created: "2022-12-12",
      updated: "2022-12-12",
      folder_id: 1,
    };

  const mockFetchTasks: { data: { metadata: APIMetaData; tasks: Task[] } } = {
    data: {
      metadata: {
        current_page: 1,
        first_page: 1,
        last_page: 1,
        total_records: 3,
        page_size: 10,
      },
      tasks: mockTasks,
    },
  };

  const mockApi = {
    tasks: {
      fetchTasks: (_p: TaskFilter) =>
        new Promise((resolve) => resolve(mockFetchTasks)),
      createTask: (_id: number, _dto: CreateTaskDTO) =>
        new Promise((resolve) =>
          resolve({
            data: {
              task: mockNewTask,
            },
          })
        ),
      updateTask: (id: number, dto: UpdateTaskDTO) => {
        const toUpdate = mockTasks.find((task) => task.id === id)
        return new Promise((resolve) =>
          resolve({
            data: {
              task: {
                ...toUpdate,
                ...dto
              },
            },
          })
        )
      },
      deleteTask: (id: number) => new Promise((resolve) => resolve(id)),
    },
  };

  const mockStore = configureStore({
    reducer: {
      tasks: tasksReducer,
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

  it("should handle initialising tasks", async () => {
    await mockStore.dispatch(fetchTasks({}));

    expect(mockStore.getState().tasks.entities).toEqual(
      mockFetchTasks.data.tasks
    );
  });

  it("should handle creating a task", async () => {
    await mockStore.dispatch(
      createTask({
        body: { title: "New task", datetime: "2022-12-12", description: "" },
        folderId: 1,
      })
    );

    expect(mockStore.getState().tasks.entities).toContainEqual(mockNewTask);
  });

  it("should handle updating a task", async () => {
    const dto = { title: "Updated", description: "Updated" };
    await mockStore.dispatch(
      updateTask({
        body: dto,
        id: 1,
      })
    );
    const expected = {
      ...mockTasks[0],
      ...dto,
    };

    expect(mockStore.getState().tasks.entities).toContainEqual(expected);
  });

  it("should handle deleting a task", async () => {
    await mockStore.dispatch(deleteTask(mockTasks[2].id));

    expect(mockStore.getState().tasks.entities).not.toContainEqual(
      mockTasks[2]
    );
  });
});
