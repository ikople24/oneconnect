import React, { createContext, useContext, useMemo, useState } from "react";

const GlobalMapContext = createContext();

export const MapContextProvider = ({ children }) => {
  const [placeSelected, setPlaceSelected] = useState(null);
  const [provinceSelected, setProvinceSelected] = useState(null);
  const [regionSelected, setRegionSelected] = useState(null);
  const [layer, changeLayer] = useState(1);
  const [coordinateSelected, setCoordinateSelected] = useState(null);

  const mapContextValue = useMemo(
    () => ({
      placeSelected,
      setPlaceSelected,
      provinceSelected,
      setProvinceSelected,
      regionSelected,
      setRegionSelected,
      layer,
      changeLayer,
      coordinateSelected,
      setCoordinateSelected,
    }),
    [
      placeSelected,
      setPlaceSelected,
      provinceSelected,
      setProvinceSelected,
      regionSelected,
      setRegionSelected,
      layer,
      changeLayer,
      coordinateSelected,
      setCoordinateSelected,
    ]
  );

  return (
    <GlobalMapContext.Provider value={mapContextValue}>
      {children}
    </GlobalMapContext.Provider>
  );
};

export const useGlobalMapContext = () => useContext(GlobalMapContext);
