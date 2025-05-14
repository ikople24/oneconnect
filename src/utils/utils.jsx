import toGeoJSON from "@mapbox/togeojson";
import JSZip from "jszip";
import * as L from "leaflet";
export const genderFormat = (gender) => {
  if (gender === "Male") {
    return "ชาย";
  } else {
    return "หญิง";
  }
};

export const convertKMZFileToObject = async (file) => {
  const zip = await JSZip.loadAsync(file);
  const kmlEntry = Object.values(zip.files).find((f) =>
    f.name.endsWith(".kml")
  );
  const kmlText = await kmlEntry.async("text");
  const parser = new DOMParser();
  const kmlDoc = parser.parseFromString(kmlText, "text/xml");
  console.log("kmlDoc", kmlDoc);
  const geojson = toGeoJSON.kml(kmlDoc);
  return geojson
};

export const renderIcon = (marker) => {
  const iconUrl = marker?.properties?.markerType?.icon;
  if (!iconUrl) return null;

  return <img width={25} height={25} className="text-center" src={iconUrl} />;
};

export function getLocationHandler({
  map,
  placeSelected,
  markerRef,
  setZoneSelected,
  setIsLatLngError,
  setIsLoadingLatLng,
  setPointSelected,
}) {
  if (!map) {
    console.log("Map not available.");
    setIsLatLngError(true);
    setIsLoadingLatLng(false);
    return;
  }

  setIsLoadingLatLng(true);
  setIsLatLngError(false);

  map.locate({ setView: true, maxZoom: 15 });
  map.off("locationfound").off("locationerror");

  map.on("locationfound", (e) => {
    const lat = e.latitude;
    const long = e.longitude;
    let isInsideZone = false;

    for (const zoneGeoJSON of placeSelected?.zones?.features) {
      const zoneLayer = L.geoJSON(zoneGeoJSON);
      if (zoneLayer.getBounds().contains([lat, long])) {
        setZoneSelected({
          zoneName: zoneGeoJSON.properties.community,
          zoneId: zoneGeoJSON._id,
        });
        isInsideZone = true;

        if (markerRef.current) {
          markerRef.current.remove();
        }

        const newMarker = L.marker([lat, long])
          .addTo(map)
          .bindPopup("คุณอยู่ตรงนี้")
          .openPopup();

        markerRef.current = newMarker;

        setIsLatLngError(false);
        map.flyTo([lat, long], 15);
        setPointSelected([lat, long]);
        break;
      }
    }

    if (!isInsideZone) {
      setIsLatLngError(true);
    }

    console.log("ตำแหน่งที่ได้รับ:", lat, long);
    setIsLoadingLatLng(false);
  });

  map.on("locationerror", (error) => {
    console.error("เกิดข้อผิดพลาดในการดึงตำแหน่ง", error);
    setIsLatLngError(true);
    setIsLoadingLatLng(false);
  });
}
