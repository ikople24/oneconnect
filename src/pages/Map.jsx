import { useState } from "react";
import "leaflet/dist/leaflet.css";
import MapLayerOne from "@/components/map/MapLayerOne";
import MapLayerTwo from "@/components/map/MapLayerTwo";
import { MapContextProvider, useGlobalMapContext } from "@/context/MapContext";

const MapContent = () => {
  const { layer } = useGlobalMapContext();
  
  return (
    <div className="bg-gray-100">
      {layer ? (
        <MapLayerOne  />
      ) : (
        <MapLayerTwo />
      )}
    </div>
  );
};

export default function ServiceAreaSelection() {
  return (
    <MapContextProvider>
      <MapContent />
    </MapContextProvider>
  );
}
