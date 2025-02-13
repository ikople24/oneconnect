import { useState} from "react";
import React from "react";
import "leaflet/dist/leaflet.css";
import MapLayerOne from "@/components/map/MapLayerOne";
import MapLayerTwo from "@/components/map/MapLayerTwo";
export default function ServiceAreaSelection() {
  const [stage, setStage] = useState(1);
  const [place, setPlace] = useState({});

  const changePage = () => {
    setStage(!stage);
  };

  return (
    <div className=" bg-gray-100  ">
      {stage ? (
        <MapLayerOne changePage={changePage} setPlace={setPlace} />
      ) : (
        <MapLayerTwo place={place} changePage={changePage} />
      )}
    </div>
  );
}
