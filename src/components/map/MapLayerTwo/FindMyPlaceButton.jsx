import { useEffect } from "react";
import * as L from "leaflet";

export const FindMyPlace = ({ map, placeSelected, markerRef }) => {
  useEffect(() => {
    const button = L.control({ position: "bottomright" });

    button.onAdd = function () {
      const div = L.DomUtil.create("button", "custom-location-button");
      div.className =
        "w-10 h-10 bg-white border border-gray-300 rounded-md flex focus:ring-2 justify-center items-center ";
      // Create the image element from a CDN link
      const icon = L.DomUtil.create("img", "location-icon");
      icon.src = "https://cdn-icons-png.flaticon.com/512/2803/2803287.png"; // Replace with your CDN link
      icon.alt = "Find me"; // Alt text for the image
      icon.className =
        "w-8 h-8 rounded-xl border shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:cursor-pointer";

      div.appendChild(icon);

      div.onclick = function () {
        map.flyTo(placeSelected?.location?.coordinates, 13);
        if (markerRef.current) {
          markerRef.current.remove();
        }
      };

      return div;
    };

    button.addTo(map);

    return () => {
      map.removeControl(button);
    };
  }, [map]);

  return null;
};
