import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const RoleGuard = ({ requiredRoles }) => {
  const { user, isLoaded } = useUser();
  if (isLoaded) {
    if (!user) {
      return <Navigate to="/login" replace />;
    }

    const userRoles = user?.publicMetadata?.role;

    const hasAccess = requiredRoles.some((role) => role === userRoles);

    if (!hasAccess) {
      return <Navigate to="/" replace />;
    }

    return <Outlet />;
  }
  return null;
};

export default RoleGuard;
