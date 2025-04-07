import { useEffect } from "react";
import React from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import thailandPolygon from "@/components/data/thailand.json";
import { Row, Col } from "antd";
import MapLayerOneSidebar from "./MapLayerOne/MapLayerOneSidebar";
import { useGlobalMapContext } from "@/context/MapContext";
import { usePlacePolygon } from "@/hooks/user-places";

const DEFAULT_CENTER = [13.885556744960699, 100.63529495228143];
const DEFAULT_ZOOM = 6;

export default function ServiceAreaSelection() {
  const { coordinateSelected,placeSelected } = useGlobalMapContext();
  const { data: placePolygonData, isLoading, isError } = usePlacePolygon();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {isError}</div>;

  
const FlyToProvince = ({ position, zoom = DEFAULT_ZOOM }) => {
  const map = useMap();

  useEffect(() => {
    if (!position || position.length !== 2) {
      map.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, { duration: 1 });
    } else {
      const [lat, lng] = position;
      if (lat === undefined || lng === undefined) {
        map.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, { duration: 1 });
      } else {
        map.flyTo(position, zoom, { duration: 1 });
      }
    }
  }, [map, position, zoom]);

  return null;
};

  return (
    <div className=" bg-gray-100">
      <Row gutter={0}>
        <Col xl={16} md={24} order={1}>
          <div className="flex flex-col items-center h-[80vh]">
            <MapContainer
              center={DEFAULT_CENTER}
              zoom={DEFAULT_ZOOM}
              className="h-full w-full "
              scrollWheelZoom={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <GeoJSON
                data={thailandPolygon}
                style={{
                  color: "#555",
                  weight: 1,
                  fillColor: "#D6D6DA",
                  fillOpacity: 0.5,
                }}
              />
              {placePolygonData.map((polygon, idx) => (
                <React.Fragment key={idx}>
                  <GeoJSON
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
                    data={polygon.zones.features}
                    style={{
                      color: "#f0ff",
                      weight: 1,
                      fillColor: "#D6D6DA",
                      fillOpacity: 0.5,
                    }}
                  />
                </React.Fragment>
              ))}

              <FlyToProvince
                position={coordinateSelected}
                zoom={placeSelected ? 13 : DEFAULT_ZOOM}
              />
            </MapContainer>
          </div>
        </Col>
        <Col
          xl={8}
          md={24}
          order={2}
          className="flex flex-col justify-center items-center p-5"
        >
          <MapLayerOneSidebar />
        </Col>
      </Row>
    </div>
  );
}
