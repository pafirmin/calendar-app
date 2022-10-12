import { ReactNode, useEffect, useState } from "react";
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
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    const authenticate = async () => {
      await dispatch(fetchUser()).unwrap();
    };

    if (!token) {
      // We know auth will fail - go to login page
      navigate("/login");
    } else if (!user) {
      // Attempt to authenticate user with existing token
      authenticate();
    } else {
      // User is authenticated
      setIsAuthenticating(false);
    }
  }, [user, token, navigate, dispatch]);

  if (isAuthenticating) {
    return null;
  }

  return <>{children}</>;
};

export default RequireAuth;
