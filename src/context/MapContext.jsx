import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { useGlobalContext } from "@/context/Context";
import { useMarker, useMarkerAdmin } from "@/hooks/user-markers";
import ApiClient from "@/utils/apiClient";
const GlobalMapContext = createContext();
const apiClient = new ApiClient();

export const MapContextProvider = ({ children }) => {
  const [placeSelected, setPlaceSelected] = useState(null);
  const [provinceSelected, setProvinceSelected] = useState(null);
  const [regionSelected, setRegionSelected] = useState(null);
  const [layer, changeLayer] = useState(1);
  const [coordinateSelected, setCoordinateSelected] = useState(null);
  const { isAdmin } = useGlobalContext();
  const [markers, setMarkers] = useState([]);
  const [enabledMarkers, setEnabledMarkers] = useState([]);
  const {
    data: markerAdmin,
    isLoading: isLoadingMakerAdmin,
    isError: isErrorMakerAdmin,
  } = useMarkerAdmin(placeSelected?._id ?? "", enabledMarkers);

  const {
    data: markerUser,
    isLoading: isLoadingMarkers,
    isError: isErrorMarkers,
  } = useMarker(placeSelected?._id ?? "", enabledMarkers);

  useEffect(() => {
    if (!placeSelected?._id) return;
    if(isLoadingMarkers){
      console.log('loadddddd', markerUser)
    }
    const isDataReady = (data, isLoading, isError) =>
      !isLoading && !isError && data;

    // filter marker in local cause tanstack cache
    const filterMarkers = (data) =>
      enabledMarkers.length > 0
        ? data.filter((marker) =>
            enabledMarkers.includes(marker?.properties?.markerType?._id)
          )
        : data;

    if (
      isAdmin &&
      isDataReady(markerAdmin, isLoadingMakerAdmin, isErrorMakerAdmin)
    ) {
      console.log("enabledMarkers", enabledMarkers);
      console.log("enabledmarkers markerAdmin", markerAdmin);
      setMarkers(filterMarkers(markerAdmin));
    }

    if (!isAdmin && isDataReady(markerUser, isLoadingMarkers, isErrorMarkers)) {
      setMarkers(filterMarkers(markerUser));
    }
  }, [
    placeSelected?._id,
    isAdmin,
    isLoadingMakerAdmin,
    isLoadingMarkers,
    isErrorMakerAdmin,
    isErrorMarkers,
    markerAdmin,
    markerUser,
    enabledMarkers,
    setEnabledMarkers,
  ]);
  const resetSelected = () => {
    setPlaceSelected(null);
    setEnabledMarkers([]);
    setMarkers([]);
    setCoordinateSelected(null);
    setRegionSelected(null);
    setProvinceSelected(null);
  };

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
      markers,
      enabledMarkers,
      setEnabledMarkers,
      resetSelected,
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
      markers,
      enabledMarkers,
      resetSelected,
    ]
  );

  return (
    <GlobalMapContext.Provider value={mapContextValue}>
      {children}
    </GlobalMapContext.Provider>
  );
};

export const useGlobalMapContext = () => useContext(GlobalMapContext);
