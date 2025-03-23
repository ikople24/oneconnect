import { useState, useEffect } from "react";
import React from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import thailandPolygon from "@/components/data/thailand.json";
import { Row, Col } from "antd";
import { ENDPOINT } from "@/components/endpoint";
import MapLayerOneSidebar from "./MapLayerOne/MapLayerOneSidebar";
import ApiClient from "@/utils/apiClient";

export default function ServiceAreaSelection({ changePage, setPlace }) {
  const [placeSelected, setPlaceSelected] = useState();
  const [placePolygon, setPlacePolygon] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [flyToLatLng, setFlyToLatLng] = useState([]);
  const apiClient = new ApiClient();

  useEffect(() => {
    const fetchData = async () => {
      await Promise.allSettled([fetchPlacePolygon()]);
    };
    fetchData();
  }, []);

  const fetchPlacePolygon = async () => {
    try {
      const url = ENDPOINT.GET_ALL_PLACE;
      const response = await apiClient.get(url);
      setPlacePolygon(response.data ?? []);
    } catch (error) {
      console.error("ERROR FETCH PLACES:", error);
    }
  };

  const FlyToProvince = ({ position, zoom }) => {
    console.log("FLY POSITION", position);
    const map = useMap();

    if (position) {
      map.flyTo(position, zoom ?? 10, {
        duration: 1.5, // Animation duration in seconds
      });
    }

    return null;
  };

  // const handleMapClick = (e) => {
  //   const { NL_NAME_1 } = e.target.feature.properties;
  //   console.log(e.target.feature.properties);
  //   console.log(NL_NAME_1.slice(7));

  //   setSelectedProvince(NL_NAME_1.slice(7) ?? null);
  // };

  return (
    <div className=" bg-gray-100">
      <Row gutter={0}>
        <Col xl={16} md={24} order={1}>
          {/* <div className="map-section flex-grow h-[60vh] lg:h-[90vh] w-full lg:w-3/4 rounded-lg shadow-lg"> */}
          <div className="flex flex-col items-center h-[80vh]">
            <MapContainer
              center={[13.885556744960699, 100.63529495228143]}
              zoom={6}
              className="h-full w-full "
              scrollWheelZoom={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {thailandPolygon && (
                <GeoJSON
                  data={thailandPolygon}
                  // onEachFeature={(feature, layer) => {
                  //   layer.on({
                  //     click: handleMapClick,
                  //   });
                  // }}
                  style={{
                    color: "#555",
                    weight: 1,
                    fillColor: "#D6D6DA",
                    fillOpacity: 0.5,
                  }}
                />
              )}
              {placePolygon &&
                placePolygon.map((polygon, idx) => {
                  return (
                    <React.Fragment key={`polygon-${idx}`}>
                      <GeoJSON
                        key={`place-${idx}`}
                        data={polygon.place.features}
                        style={{
                          color: "black",
                          weight: 4,
                          fillColor: "#D6D6DA",
                          fillOpacity: 0.5,
                          dashArray: "4 10",
                        }}
                      />
                      <GeoJSON
                        key={`zone-${idx}`}
                        data={polygon.zones.features}
                        style={{
                          color: "#f0ff",
                          weight: 1,
                          fillColor: "#D6D6DA",
                          fillOpacity: 0.5,
                        }}
                      />
                    </React.Fragment>
                  );
                })}

              {selectedProvince && (
                <>
                  <FlyToProvince position={flyToLatLng} />
                </>
              )}
              {placeSelected && (
                <>
                  <FlyToProvince position={flyToLatLng} zoom={13} />
                </>
              )}
            </MapContainer>
          </div>
        </Col>
        <Col
          xl={8}
          md={24}
          order={2}
          className="flex flex-col justify-center items-center p-5"
        >
          {/* -------- Sidebar -------- */}
          <MapLayerOneSidebar
            changePage={changePage}
            selectedProvince={selectedProvince}
            placeSelected={placeSelected}
            setFlyToLatLng={setFlyToLatLng}
            setPlaceSelected={setPlaceSelected}
            setPlace={setPlace}
            setSelectedProvince={setSelectedProvince}
          />
        </Col>
      </Row>
    </div>
  );
}
