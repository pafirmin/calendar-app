import { PropsWithChildren, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchUser } from "./auth.slice";

const RequireAuth = ({ children }: PropsWithChildren) => {
  const { user, token } = useAppSelector(({ auth }) => auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, [user, dispatch]);

  if (!user && !token) {
    return null;
  }

  return children;
};

export default RequireAuth;
