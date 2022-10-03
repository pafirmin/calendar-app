import { StatusCodes } from "http-status-codes";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { APIError } from "../../common/types";
import { unexpectedError } from "../alerts/alerts.slice";
import { fetchUser } from "./auth.slice";

interface Props {
  children: ReactNode;
}

const RequireAuth = ({ children }: Props) => {
  const { user, token } = useAppSelector(({ auth }) => auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const authenticate = useCallback(async () => {
    try {
      setLoading(true);
      await dispatch(fetchUser()).unwrap();
    } catch (err: any) {
      switch ((err as APIError).status) {
        case StatusCodes.UNAUTHORIZED:
          navigate("/login");
          break;
        default:
          dispatch(unexpectedError());
          break;
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (!token) {
      // We know auth will fail - go to login page
      navigate("/login");
    } else if (!user) {
      // Attempt to authenticate user
      authenticate();
    }
  }, [user, token, navigate, authenticate, dispatch]);

  if (loading) {
    return null;
  }

  return <>{children}</>;
};

export default RequireAuth;
