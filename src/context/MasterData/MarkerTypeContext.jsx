import React, { createContext, useContext, useMemo, useState } from "react";
const MarkerTypeContext = createContext();

export const MarkerTypeContextProvider = ({ children }) => {
  const [mainMarkerTypeSelected, setMainMarkerTypeSelected] = useState(null);
  const markerTypeContextValue = useMemo(
    () => ({
      mainMarkerTypeSelected,
      setMainMarkerTypeSelected,
    }),
    [mainMarkerTypeSelected, setMainMarkerTypeSelected]
  );

  return (
    <MarkerTypeContext.Provider value={markerTypeContextValue}>
      {children}
    </MarkerTypeContext.Provider>
  );
};

export const useMarkerTypeContext = () => useContext(MarkerTypeContext);
