import { ReactNode, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
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
    setLoading(true);
    await dispatch(fetchUser());
    setLoading(false);
  }, [dispatch]);

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
