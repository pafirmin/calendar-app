import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import {
  MonthPicker as MuiMonthPicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import ArrowBackIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIcon from "@mui/icons-material/ArrowForwardIos";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setSelectedDate } from "./month-picker.slice";
import { useMemo } from "react";

const MonthPicker = () => {
  const dispatch = useAppDispatch();
  const { selectedDate } = useAppSelector((state) => state.monthPicker);
  const date = useMemo(() => new Date(selectedDate), [selectedDate]);

  const handlePickMonth = (val: Date) => {
    dispatch(setSelectedDate(val));
  };

  const handlePickYear = (num: number) => {
    const newDate = date;
    newDate.setFullYear(date.getFullYear() + num);

    dispatch(setSelectedDate(newDate));
  };

  return (
    <Box marginBottom={1} marginTop={1}>
      <Stack
        margin="auto"
        direction="row"
        justifyContent="space-around"
        alignItems="center"
      >
        <Tooltip title="Back a year">
          <IconButton
            aria-label="go back a year"
            onClick={() => handlePickYear(-1)}
          >
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Typography
          aria-label="selected-year"
          fontWeight="bold"
          component="time"
        >
          {date.getFullYear()}
        </Typography>
        <Tooltip title="Forward a year">
          <IconButton
            aria-label="go forward a year"
            onClick={() => handlePickYear(1)}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Tooltip>
      </Stack>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MuiMonthPicker
          sx={{ margin: "auto" }}
          date={new Date(selectedDate)}
          onChange={handlePickMonth}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default MonthPicker;
