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
import { GeoJSON, LayersControl } from "react-leaflet";
import { ENDPOINT } from "../endpoint";
import ModalAddMarker from "@/components/modal/ModalAddMarker";
import "leaflet-easybutton";
import * as L from "leaflet";
import { ArrowLeftOutlined } from "@ant-design/icons";
import ModalMarkerDetail from "@/components/modal/ModalMarkerDetail";
import leaderIcon from "@/assets/markerIcon/community_leader.png";
import olderIcon from "@/assets/markerIcon/older_person.png";
import philosopherIcon from "@/assets/markerIcon/philosopher.png";
import rescueIcon from "@/assets/markerIcon/rescue.png";
import { useGlobalContext } from "@/context/Context";
import TableEditMarkerAdmin from "./MapLayerTwo/TableEditMarkerAdmin";
import MapLayerTwoSidebar from "./MapLayerTwo/MapLayerTwoSidebar";
export default function MapLayerTwo(props) {
  const { place, changePage } = props;
  const { TEST, setTest } = useGlobalContext();
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
  const [modalMarkerIsVisible, setModalMarkerIsVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isLoadingLatLng, setIsLoadingLatLng] = useState(false);
  const [isLatLngError, setIsLatLngError] = useState(false);
  const [isTriggerReq, setIsTriggerReq] = useState(false);

  useEffect(() => {
    console.log("FROM CONTEXT", TEST);
    fetchData();
  }, [isAdmin]);
  const fetchData = async () => {
    if (isAdmin) {
      await Promise.allSettled([fetchMarkerAdmin(place?._id)]);
    } else {
      await Promise.allSettled([fetchMarkers(place?._id)]);
    }
    await fetchPinTypes(place?._id);
  };
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

  const LocationMarker = ({ isAdmin, setPointSelected, pointSelected }) => {
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

  const addIconByMarkerType = (type) => {
    switch (type) {
      case "ผู้สูงอายุ":
        const older = L.icon({
          iconUrl: olderIcon, // Replace with your own icon URL
          iconSize: [32, 32], // Size of the icon
          iconAnchor: [16, 32], // Anchor point of the icon (half of width for centering)
          popupAnchor: [0, -32], // Position of the popup relative to the icon
        });
        return older;
      case "ปราชญ์ชุมชน":
        const philosopher = L.icon({
          iconUrl: philosopherIcon,
          iconSize: [32, 32], // Size of the icon
          iconAnchor: [16, 32], // Anchor point of the icon (half of width for centering)
          popupAnchor: [0, -32], // Position of the popup relative to the icon
        });
        return philosopher;
      case "ผู้นำชุมชน":
        const leader = L.icon({
          iconUrl: leaderIcon, // Replace with your own icon URL
          iconSize: [32, 32], // Size of the icon
          iconAnchor: [16, 32], // Anchor point of the icon (half of width for centering)
          popupAnchor: [0, -32], // Position of the popup relative to the icon
        });
        return leader;
      case "กู้ภัย":
        const rescue = L.icon({
          iconUrl: rescueIcon, // Replace with your own icon URL
          iconSize: [32, 32], // Size of the icon
          iconAnchor: [16, 32], // Anchor point of the icon (half of width for centering)
          popupAnchor: [0, -32], // Position of the popup relative to the icon
        });
        return rescue;

      default:
        return L.icon({
          iconUrl: "https://cdn-icons-png.flaticon.com/512/1397/1397898.png",
          iconSize: [32, 32], // Size of the icon
          iconAnchor: [16, 32], // Anchor point of the icon (half of width for centering)
          popupAnchor: [0, -32], // Position of the popup relative to the icon
        });
    }
  };

  const LayerControllerFilterHandler = (type) => {
    const markerTypeFilter = markers.filter(
      (marker) => marker.properties.markerType === type
    );

    const markerInLayer = markerTypeFilter.map((marker) => (
      <Marker
        key={marker._id}
        position={marker.geometry.coordinates}
        icon={addIconByMarkerType(marker.properties.markerType)}
      >
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
          <MapLayerTwoSidebar
            place={place}
            isAdmin={isAdmin}
            setIsAdmin={setIsAdmin}
          />
        </div>
      </div>
      <TableEditMarkerAdmin
        markers={markers}
        isAdmin={isAdmin}
        setModalMarkerIsVisible={setModalMarkerIsVisible}
        setSelectedRecord={setSelectedRecord}
        modalMarkerIsVisible={modalMarkerIsVisible}
        fetchData={fetchData}
      />

      <ModalMarkerDetail
        visible={modalMarkerIsVisible}
        onCancel={() => setModalMarkerIsVisible(false)}
        data={selectedRecord}
      />
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
