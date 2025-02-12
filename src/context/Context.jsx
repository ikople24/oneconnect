import React, { createContext, useState, useContext, useMemo } from "react";

const GlobalContext = createContext();

export const ContextProvider = ({ children }) => {
  const [TEST, SET_TEST] = useState("OK JA");
  const setTest = (val) => {
    SET_TEST(val);
  };
  const contextValue = useMemo(() => ({ TEST, setTest }), [TEST]);
  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext= () => useContext(GlobalContext);
