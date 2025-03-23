import { Navigate, Outlet } from "react-router";
import { useAuth } from "@clerk/clerk-react";

const AuthGuard = () => {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
