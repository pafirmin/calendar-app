import { Box, Button, Paper, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { showError } from "../alerts/alerts.slice";
import { Credentials, login } from "./auth.slice";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
      case 401:
        dispatch(showError("Invalid credentials"));
        console.log("Unauthorised");
        break;
      default:
        dispatch(showError(response.payload.message));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          type="text"
          label="Email"
          name="email"
          value={values.email}
          onChange={handleChange}
        />
        <TextField
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
