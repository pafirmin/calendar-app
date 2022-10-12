import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { StatusCodes } from "http-status-codes";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { guestLogin, login } from "./auth.slice";
import { Credentials } from "./interfaces";

const AUTH_FAIL_MESSAGE = "Incorrect username or password.";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    try {
      setIsSubmitting(true);
      await dispatch(login(values)).unwrap();

      navigate("/");
    } catch (err: any) {
      switch (err.status) {
        case StatusCodes.UNAUTHORIZED:
          setMessage(AUTH_FAIL_MESSAGE);
          break;
        default:
          break;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      await dispatch(guestLogin()).unwrap();

      navigate("/");
    } catch (err: any) {
      switch (err.status) {
        case StatusCodes.UNAUTHORIZED:
          setMessage(AUTH_FAIL_MESSAGE);
          break;
        default:
          break;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={(theme) => ({
        width: "100vw",
        height: "100vh",
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, rgba(44,79,112,1) 49%, rgb(76, 50, 168) 100%)`,
        display: "inline-block",
      })}
    >
      <Paper sx={{ padding: 4, maxWidth: 400, margin: "20vh auto 0 auto" }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h2" textAlign="center" marginBottom={4}>
            Login
          </Typography>
          {message && <Typography align="center">{message}</Typography>}
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
            <Button variant="outlined" type="submit" disabled={isSubmitting}>
              Login
            </Button>
            <Button
              onClick={handleGuestLogin}
              variant="contained"
              disabled={isSubmitting}
            >
              Login with guest account
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
