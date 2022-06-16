import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import folderReducer from '../features/folders/folders.slice';

export const store = configureStore({
  reducer: {
    folders: folderReducer,
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
