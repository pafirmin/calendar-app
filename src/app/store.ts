import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import folderReducer from '../features/folders/folders.slice';
import tasksReducer from '../features/tasks/tasks.slice';

export const store = configureStore({
  reducer: {
    folders: folderReducer,
    tasks: tasksReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
