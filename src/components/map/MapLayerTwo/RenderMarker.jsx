import { Marker, Popup } from "react-leaflet";
import * as L from "leaflet";
import { Button } from "antd";

export const RenderMarker = ({ markers, isAdmin, handleView, handleMaintainView }) => {
  const getIcon = (iconUrl) => {
    console.log(iconUrl);
    if (!iconUrl) {
      // Return a default icon when iconUrl is missing
      return L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });
    }

    return L.icon({
      // iconUrl: iconBaseUrl + iconUrl,
      iconUrl: iconUrl,
      iconSize: [32, 32], // Adjust size [width, height]
      iconAnchor: [16, 32], // Point of the icon that corresponds to marker's location
      popupAnchor: [0, -32],
    });
  };

  return (
    <>
      {markers.map((marker) => {
        return isAdmin ? (
          <Marker
            key={marker._id}
            position={marker.geometry.coordinates}
            icon={getIcon(marker.properties?.markerType?.icon)}
            // pane="customPane"
          >
            <Popup>
              <div className="py-2">
                ชื่อ : {marker.properties?.markerInfo.name}
              </div>
              <div className="py-2">
                ประเภท : {marker.properties?.markerType?.name}
              </div>
              <div className="text-center">
                <Button type="primary" onClick={() => handleView(marker)}>
                  ดูรายละเอียด
                </Button>
              </div>
            </Popup>
          </Marker>
        ) : (
          <Marker
            key={marker._id}
            position={marker.geometry.coordinates}
            icon={getIcon(marker.properties?.markerType?.icon)}
            // pane="customPane"
          >
            <Popup>
              <div className="py-2">
                ชื่อ : {marker.properties?.markerInfo.name}
              </div>
              <div className="py-2">
                ประเภท : {marker.properties?.markerType?.name}
              </div>
              {marker.properties.markerType.type.name === "Repair" && (
                <div className="text-center">
                  <Button type="primary" onClick={() => handleMaintainView(marker)}>
                    ดูรายละเอียด
                  </Button>
                </div>
              )}
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};
