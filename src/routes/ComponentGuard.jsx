import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router";



const ComponentGuard= ({ children, allowedRoles, fallback }) => {
  const { user } = useUser();


  const userRoles = user?.publicMetadata?.role;
  const hasAccess = allowedRoles.some((role) => role === userRoles);

  if (!hasAccess) {
    return fallback ;
  }

  return <>{children}</>;
};

export default ComponentGuard;
