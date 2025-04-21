import { Marker, Popup } from "react-leaflet";
import * as L from "leaflet";
import { Button } from "antd";

export const LocationMarker = ({ isAdmin, setIsModalVisible,isModalVisible, pointSelected }) => {
  const LeafIcon = L.Icon.extend({
    options: {},
  });

  const currentMarkerIcon = new LeafIcon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/14090/14090313.png",
    iconSize: [40, 45],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
  return pointSelected && isAdmin ? (
    <Marker position={pointSelected} icon={currentMarkerIcon}>
      <Popup>
        <Button
          type="primary"
          size=""
          onClick={() => {
            setIsModalVisible(!isModalVisible);
          }}
        >
          ปักหมุดแผนที่
        </Button>
      </Popup>
    </Marker>
  ) : null;
};
