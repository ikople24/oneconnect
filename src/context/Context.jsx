import React, {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState,
} from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import Role from "@/enum/role.enum";

const GlobalContext = createContext();

export const ContextProvider = ({ children }) => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    console.log("📌 ContextProvider rendering...");
    console.log("📌 Clerk user:", user);
  }, [user]);

  useEffect(() => {
    if (user) {
      console.log("📌 Updating currentUser in state:", user);
      setCurrentUser(user);
    }
  }, [user]); // Re-run effect when `user` changes

  const role = currentUser?.publicMetadata?.role;
  const isAdmin = role === Role.SUPER_ADMIN;
  const userPlaceId = currentUser?.publicMetadata?.places || null; // Ensure it's always an array

  const checkIsAdminPlace = (placeId) => {
    if (role === Role.SUPER_ADMIN) return true;
    if (role === Role.ADMIN && userPlaceId === placeId) {
      return true;
    }
    return false;
  };

  const contextValue = useMemo(
    () => ({
      userPlaceId,
      isSignedIn,
      user: currentUser, // Always updated user
      isAdmin,
      role,
      signOut,
      isLoaded,
      checkIsAdminPlace,
    }),
    [isSignedIn, currentUser, role, signOut, isLoaded]
  );

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
