import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { StatusCodes } from "http-status-codes";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { showError } from "../alerts/alerts.slice";
import { login } from "./auth.slice";
import { Credentials } from "./interfaces";

const AUTH_FAIL_MESSAGE = "Incorrect username or password.";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("");
  const [values, setValues] = useState<Credentials>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await dispatch(login(values));

    if (login.fulfilled.match(response)) {
      return navigate("/");
    }

    switch (response.payload.status) {
      case StatusCodes.UNAUTHORIZED:
        setMessage(AUTH_FAIL_MESSAGE);
        break;
      default:
        dispatch(showError(response.payload.message));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography align="center">{message}</Typography>
      <Stack spacing={2}>
        <TextField
          required
          type="email"
          label="Email"
          name="email"
          value={values.email}
          onChange={handleChange}
        />
        <TextField
          required
          type="password"
          label="Password"
          name="password"
          value={values.password}
          onChange={handleChange}
        />
        <Button type="submit">Login</Button>
      </Stack>
    </Box>
  );
};

export default Login;
