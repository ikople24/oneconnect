import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayerGroup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";
import { Button } from "antd";
import { GeoJSON, useMapEvent, LayersControl } from "react-leaflet";
import { ENDPOINT } from "../endpoint";
import { SwitchMode } from "../admin/SwitchMode";
import ModalAddMarker from "../modal/ModalAddMarker";
import "leaflet-easybutton";
import * as L from "leaflet";
import { ArrowLeftOutlined, StepBackwardFilled } from "@ant-design/icons";
import { StepBackIcon } from "lucide-react";

export default function MapLayerTwo(props) {
  const { place, changePage } = props;
  const markerRef = useRef(null);
  const [isAdmin, setIsAdmin] = useState(0);
  const [pointSelected, setPointSelected] = useState(
    isAdmin && place?.location?.coordinates
  );
  const [map, setMap] = useState(null);
  const [zoneSelected, setZoneSelected] = useState();
  const [markers, setMaker] = useState([]);
  const [pinTypes, setPinTypes] = useState([]);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoadingLatLng, setIsLoadingLatLng] = useState(false);
  const [isLatLngError, setIsLatLngError] = useState(false);
  const [isTriggerReq, setIsTriggerReq] = useState(false);
  useEffect(() => {
    // console.log(place);
    const fetchData = async () => {
      if (isAdmin) {
        await Promise.allSettled([fetchMarkerAdmin(place?._id)]);
      } else {
        await Promise.allSettled([fetchMarkers(place?._id)]);
      }
      await fetchPinTypes(place?._id);
    };
    // getLocation();
    fetchData();
  }, [isAdmin]);

  const getLocation = () => {
    setIsTriggerReq(true);
    setIsLoadingLatLng(true);
    setIsLatLngError(false);

    if (map) {
      map.locate({ setView: true, maxZoom: 15 }); // Request the user's location
      map.off("locationfound").off("locationerror");
      map.on("locationfound", (e) => {
        const lat = e.latitude;
        const long = e.longitude;
        let isInsideZone = false;

        for (const zoneGeoJSON of place.zones.features) {
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

            // Create a new marker and store it in the reference
            const newMarker = L.marker([lat, long])
              .addTo(map)
              .bindPopup("You are here and inside the zone!")
              .openPopup();

            markerRef.current = newMarker; // Store the new marker in the reference

            setIsLatLngError(false);
            map.flyTo([lat, long], 15);
            setPointSelected([lat, long]);
            break;
          }
        }

        if (!isInsideZone) {
          setIsLatLngError(true);
          setIsLoadingLatLng(false);
        }
        console.log("ตำแหน่งที่ได้รับ:", lat, long);
        setIsLoadingLatLng(false);
      });

      map.on("locationerror", (error) => {
        console.error("เกิดข้อผิดพลาดในการดึงตำแหน่ง", error);
        setIsLatLngError(true);
        setIsLoadingLatLng(false);
      });
    } else {
      console.log("Map not available.");
      setIsLatLngError(true);
      setIsLoadingLatLng(false);
    }
  };

  const FindMyLocationButton = ({ map, setPointSelected, zonesGeoJSON }) => {
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
              if (markerRef.current) {
                markerRef.current.remove();
              }

              const newMarker = L.marker(userLatLng)
                .addTo(map)
                .bindPopup("You are here and inside the zone!")
                .openPopup();

              markerRef.current = newMarker;

              map.flyTo(userLatLng, 15);
            })
            .on("locationerror", function () {
              alert("Location access denied or unavailable.");
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
  const FindMyPlace = ({ map }) => {
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
          map.flyTo(place?.location?.coordinates, 13);
          markerRef.current.remove();
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

  const fetchMarkers = async (placeId) => {
    try {
      // console.log(placeId);
      const params = new URLSearchParams({
        placeId: placeId ?? "",
      });
      // console.log(params);

      const markers = await fetch(
        `${ENDPOINT.GET_MARKERS}?${params.toString()}`
      );
      const response = await markers.json();
      // console.log(response);

      setMaker(response ?? []);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchMarkerAdmin = async (placeId) => {
    try {
      console.log(placeId);
      const params = new URLSearchParams({
        placeId: placeId ?? "",
      });
      // console.log(params);

      const markers = await fetch(
        `${ENDPOINT.GET_ALL_MARKER_ADMIN}?${params.toString()}`
      );
      const response = await markers.json();
      // console.log(response);

      setMaker(response ?? []);
    } catch (error) {
      console.error(error);
    }
  };
  const [summary, setSummary] = useState({ elderly_count: 150 });

  const LocationMarker = ({ isAdmin, setPointSelected, pointSelected }) => {
    const LeafIcon = L.Icon.extend({
      options: {},
    });

    const currentMarkerIcon = new LeafIcon({
      iconUrl:
        "https://cdn.discordapp.com/attachments/1327135943957676085/1338064336152690780/1.png?ex=67a9b905&is=67a86785&hm=3cb54ec18720754ce4f4b8c0b2b1772ac3e3e469846b199bf107ee939e7ac7b6&",
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
              console.log("ZONE", zoneSelected);
              setIsModalVisible(!isModalVisible);
            }}
          >
            ปักหมุดแผนที่
          </Button>
        </Popup>
      </Marker>
    ) : null;
  };

  const handleMapClick = (e) => {
    console.log(e);
    const { lat, lng } = e.latlng;

    setPointSelected([lat, lng]);
    const { community } = e.target.feature.properties; // Access the feature properties
    const zoneName = community; // Assuming 'community' is the zone name
    const zoneId = e.target.feature._id; // Access the feature ID
    setZoneSelected({
      zoneName: zoneName,
      zoneId: zoneId,
    });
    console.log(`Clicked on Zone: ${zoneName} (ID: ${zoneId})`);
  };

  const LayerControllerFilterHandler = (type) => {
    const markerTypeFilter = markers.filter(
      (marker) => marker.properties.markerType === type
    );

    const markerInLayer = markerTypeFilter.map((marker) => (
      <Marker key={marker._id} position={marker.geometry.coordinates}>
        {isAdmin ? (
          <Popup>
            <div className="py-2">{marker.properties?.name}</div>
            <div className="border p-2 rounded-xl">
              <div>
                ชื่อ - นามสกุล : {marker.properties?.users?.firstName}{" "}
                {marker.properties?.users?.lastName}
              </div>
              <div>เพศ: {marker.properties?.users?.gender}</div>
              <div>อายุ: {marker.properties?.users?.age}</div>
              <div>ชุมชน : {marker.properties?.users?.zoneName}</div>
            </div>
          </Popup>
        ) : (
          <Popup>{marker.properties.name}</Popup>
        )}
      </Marker>
    ));

    return markerInLayer;
  };

  // fetch ข้อมูลประเภทหมุดแต่ละเมือง
  const fetchPinTypes = async (placeId) => {
    try {
      const params = new URLSearchParams({
        placeId: placeId ?? "",
      });
      const response = await fetch(
        `${ENDPOINT.GET_ALL_PINTYPES}?${params?.toString()}`
      );

      if (!response.ok) {
        console.log("Can not fetch :: pinTypes");
      }

      const data = await response.json();
      console.log("Pin types:", data);
      setPinTypes(data);
    } catch (error) {
      console.log("error", error);
    }
  };

  // method สำหรับ เพิ่มหมุด
  const handleAddMarker = async (values) => {
    try {
      const bodyData = {
        geometry: {
          type: "Point",
          coordinates: [
            parseFloat(values.longitude),
            parseFloat(values.latitude),
          ],
        },
        properties: {
          name: values.name,
          markerType: values.pinType,
          users: {
            firstName: values.firstName,
            lastName: values.lastName,
            placeName: values.zone,
            zoneName: values.zone,
            gender: values.gender,
            idCard: values.idCard,
            telNumber: values.telNumber || "",
            birthdate: values.birthdate.format("YYYY-MM-DD"),
            age: parseInt(values.age, 10),
          },
          places: {
            placeId: place._id,
            zoneId: place._id,
          },
        },
      };

      if (!isAdmin) {
        const latlng = L.latLng(
          parseFloat(values.latitude),
          parseFloat(values.longitude)
        );
        const zoneLayer = L.geoJSON(place.zones);
        if (!zoneLayer.getBounds().contains(latlng)) {
          throw new Error(
            "The provided latitude and longitude are outside the zone."
          );
        }
      }
      const response = await fetch(`${ENDPOINT.CREATE_MARKER}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      if (isAdmin) {
        await Promise.allSettled([fetchMarkerAdmin(place?._id)]);
      } else {
        await Promise.allSettled([fetchMarkers(place?._id)]);
      }
      setIsModalVisible(!isModalVisible);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* แผนที่ */}
        <div className="lg:col-span-2 bg-white shadow-lg rounded-lg p-6 relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex justify-start items-center w-1/3">
              <div
                className="hover:cursor-pointer"
                onClick={() => changePage()}
              >
                <span>
                  <ArrowLeftOutlined /> เลือกเมือง
                </span>
              </div>
            </div>
            <div className="flex justify-center items-center w-1/3">
              <h2 className="text-xl font-bold text-gray-700 ">
                แผนที่ เมือง{place.amphurName}
              </h2>
            </div>
            <div className="flex justify-end items-center w-1/3">
              <Button
                type="primary"
                onClick={() => setIsModalVisible(!isModalVisible)}
              >
                ปักหมุดแผนที่
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 relative">
            <MapContainer
              center={place?.location?.coordinates}
              zoom={13}
              style={{ height: "600px", width: "100%" }}
              whenReady={(mapInstance) => setMap(mapInstance.target)}
            >
              {map && (
                <>
                  <FindMyLocationButton
                    map={map}
                    setPointSelected={setPointSelected}
                    zonesGeoJSON={place.zones.features}
                  />
                  <FindMyPlace
                    map={map}
                    setPointSelected={setPointSelected}
                    zonesGeoJSON={place.zones.features}
                  />
                </>
              )}
              <LayersControl position="topright">
                {pinTypes[0]?.pinTypes.map((type, idx) => {
                  return (
                    <LayersControl.Overlay key={idx} name={type} checked>
                      <LayerGroup>
                        {LayerControllerFilterHandler(type)}
                      </LayerGroup>
                    </LayersControl.Overlay>
                  );
                })}
              </LayersControl>
              <LocationMarker
                isAdmin={isAdmin}
                setPointSelected={setPointSelected}
                pointSelected={pointSelected}
              />
              {
                <React.Fragment key={`polygon`}>
                  <GeoJSON
                    key={`place`}
                    data={place.place.features}
                    style={{
                      color: "#f0ff",
                      weight: 1,
                      fillColor: "#D6D6DA",
                      fillOpacity: 0.5,
                    }}
                  />
                  <GeoJSON
                    key={`zone`}
                    data={place.zones.features}
                    style={{
                      color: "#f0ff",
                      weight: 1,
                      fillColor: "#D6D6DA",
                      fillOpacity: 0.5,
                    }}
                    onEachFeature={(feature, layer) => {
                      console.log(feature);
                      console.log("LAYER:", layer);
                      layer.on({
                        click: handleMapClick,
                      });
                    }}
                  />
                </React.Fragment>
              }
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            </MapContainer>
          </div>
        </div>
        {/* ข้อมูลสรุปและข้อมูลตามชุมชน */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <SwitchMode isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
          <h2 className="text-xl font-bold text-gray-700">ข้อมูลสรุป</h2>
          <p className="text-gray-600 text-lg">
            จำนวนผู้สูงอายุในระบบ:{" "}
            <span className="font-semibold text-blue-600">
              {summary.elderly_count}
            </span>
          </p>
          <h2 className="text-xl font-bold text-gray-700 mt-4">
            ข้อมูลตามชุมชน
          </h2>
          <ul className="space-y-3 mt-2">
            {/* {communities.map((community) => (
              <li
                key={community.id}
                className="p-3 bg-gray-50 rounded-md border border-gray-300"
              >
                <span className="font-semibold text-gray-800">
                  {community.name}
                </span>
                :
                <span className="text-blue-600 font-medium">
                  {" "}
                  {community.elderly_count} คน
                </span>
              </li>
            ))} */}
          </ul>
        </div>
      </div>

      {/* Modal */}
      <ModalAddMarker
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(!isModalVisible)}
        data={pinTypes[0]}
        handleOK={handleAddMarker}
        pointSelected={pointSelected}
        zoneSelected={zoneSelected}
        place={place}
        getLocation={getLocation}
        isLoadingLatLng={isLoadingLatLng}
        isLatLngError={isLatLngError}
        isTriggerReq={isTriggerReq}
        isAdmin={isAdmin}
      />
    </div>
  );
}
