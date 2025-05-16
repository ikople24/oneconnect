import { useEffect } from "react";
import * as L from "leaflet";
export const FindMyLocationButton = ({ map, setPointSelected, zonesGeoJSON, markerRef }) => {
  useEffect(() => {
    if (!map || !zonesGeoJSON || zonesGeoJSON.length === 0) return;

    const button = L.control({ position: "bottomright" });

    button.onAdd = function () {
      const div = L.DomUtil.create("button", "custom-location-button");
      div.className =
        "w-10 h-10 bg-white border border-gray-300 rounded-md flex focus:ring-2 justify-center items-center ";
      // Create the image element from a CDN link
      const icon = L.DomUtil.create("img", "location-icon");
      icon.src = "https://cdn-icons-png.flaticon.com/512/3710/3710297.png"; // Replace with your CDN link
      icon.alt = "Find me"; // Alt text for the image
      icon.className =
        "w-8 h-8 rounded-xl border shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:cursor-pointer";

      div.appendChild(icon);

      div.onclick = function () {
        map.off("locationfound").off("locationerror");
        map
          .locate()
          .on("locationfound", function (e) {
            const userLatLng = e.latlng;
            console.log(e);
            console.log(userLatLng);
            const userIcon = L.icon({
              iconUrl:
                "https://cdn-icons-png.flaticon.com/512/3710/3710297.png", // Replace with the path to your custom icon
              iconSize: [32, 32], // Size of the icon [width, height]
              iconAnchor: [16, 32], // Point of the icon which will correspond to the marker's location
              popupAnchor: [0, -32], // Point from which the popup should open relative to the iconAnchor
            });
            if (markerRef.current) {
              markerRef.current.remove();
            }

            const newMarker = L.marker(userLatLng, { icon: userIcon })
              .addTo(map)
              .bindPopup("คุณอยู่ตรงนี้")
              .openPopup();

            markerRef.current = newMarker;

            map.flyTo(userLatLng, 15);
          })
          .on("locationerror", function () {
            alert("การเข้าถึงตำแหน่งถูกปฏิเสธ หรือไม่สามารถใช้งานได้");
          });
      };

      return div;
    };

    button.addTo(map);

    return () => {
      map.removeControl(button);
    };
  }, [map, setPointSelected, zonesGeoJSON]);

  return null;
};
