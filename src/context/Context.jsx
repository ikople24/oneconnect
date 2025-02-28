import React, { createContext, useState, useContext, useMemo } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import Role from "@/enum/role.enum";
const GlobalContext = createContext();

export const ContextProvider = ({ children }) => {
  const { isSignedIn, user } = useUser();
  const { signOut } = useAuth();
  const isAdmin = user?.publicMetadata?.role === Role.SUPER_ADMIN;
  const role = user?.publicMetadata?.role;
  const userPlaceId = user?.publicMetadata?.placeId;
  const checkIsAdminPlace = (placeId) => {
    if (role === Role.SUPER_ADMIN) {
      return true;
    } else if (role === Role.ADMIN && userPlaceId === placeId) {
      return true;
    }
    return false;
  };
  const contextValue = useMemo(
    () => ({
      isSignedIn,
      user,
      isAdmin,
      signOut,
      checkIsAdminPlace,
    }),
    [isSignedIn, user]
  );
  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
