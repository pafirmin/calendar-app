import { ReactElement, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchUser } from "./auth.slice";

interface Props {
  children: ReactElement;
}

const RequireAuth = ({ children }: Props) => {
  const { user, token } = useAppSelector(({ auth }) => auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !token) {
      navigate("/login");
    }
    if (!user) {
      dispatch(fetchUser());
    }
  }, [user, token, navigate, dispatch]);

  return children;
};

export default RequireAuth;
