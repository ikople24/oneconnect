import { useState } from "react";
import "leaflet/dist/leaflet.css";
import MapLayerOne from "@/components/map/MapLayerOne";
import MapLayerTwo from "@/components/map/MapLayerTwo";
import { MapContextProvider, useGlobalMapContext } from "@/context/MapContext";

const MapContent = ({ setPlace, place }) => {
  const { layer } = useGlobalMapContext();
  
  return (
    <div className="bg-gray-100">
      {layer ? (
        <MapLayerOne  />
      ) : (
        <MapLayerTwo place={place} />
      )}
    </div>
  );
};

export default function ServiceAreaSelection() {
  const [place, setPlace] = useState({});

  return (
    <MapContextProvider>
      <MapContent place={place} setPlace={setPlace} />
    </MapContextProvider>
  );
}
