import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { selectedDate: string } = {
  selectedDate: new Date().toISOString(),
};

const monthPickerSlice = createSlice({
  name: "month-picker",
  initialState,
  reducers: {
    setSelectedDate: (state, { payload }: PayloadAction<string>) => {
      state.selectedDate = payload;
    },
  },
});

export const { setSelectedDate } = monthPickerSlice.actions;

export default monthPickerSlice.reducer;
