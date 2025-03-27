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
import { useUser } from "@clerk/clerk-react";
import Role from "@/enum/role.enum";
import MainMarkerTypeEnum from "@/enum/main-marker-type";
import ComponentGuard from "@/routes/ComponentGuard";
import ApiClient from "@/utils/ApiClient";
import ModalEditMarkerDetail from "../modal/ModalEditMarker";

export default function MapLayerTwo(props) {
  const { place, changePage } = props;
  const { checkIsAdminPlace, isLoaded } = useGlobalContext();
  const markerRef = useRef(null);

  const [isAdmin, setIsAdmin] = useState(
    checkIsAdminPlace(place?._id) || false
  );
  const [pointSelected, setPointSelected] = useState(
    isAdmin && place?.location?.coordinates
  );
  const [map, setMap] = useState(null);
  const [zoneSelected, setZoneSelected] = useState();
  const [markers, setMaker] = useState([]);
  const [summaryPlaceMarker, setSummaryPlaceMarker] = useState([]);
  const [pinTypes, setPinTypes] = useState([]);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMarkerIsVisible, setModalMarkerIsVisible] = useState(false);
  const [modalEditMarkerIsVisible, setModalEditMarkerIsVisible] =
    useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isLoadingLatLng, setIsLoadingLatLng] = useState(false);
  const [isLatLngError, setIsLatLngError] = useState(false);
  const [isTriggerReq, setIsTriggerReq] = useState(false);
  const [enabledMarkers, setEnabledMarkers] = useState([]);
  const apiClient = new ApiClient();
  useEffect(() => {
    console.log(enabledMarkers);
    if (isAdmin) {
      fetchMarkerAdmin(place?._id);
    } else {
      fetchMarkers(place?._id);
    }
  }, [enabledMarkers]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    if (isAdmin) {
      fetchMarkerAdmin(place?._id);
    } else {
      fetchMarkers(place?._id);
    }
    await fetchPinTypes(place?._id);
    await fetchPlaceSummaryMarker(place?._id);
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
      const params = new URLSearchParams({
        placeId: placeId ?? "",
      });
      const url = `${ENDPOINT.GET_MARKERS}?${params.toString()}`;
      const response = await apiClient.post(url, {
        markerTypeFilter: enabledMarkers,
      });
      setMaker(response ?? []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPlaceSummaryMarker = async (placeId) => {
    try {
      const url = `${ENDPOINT.GET_SUMMARY_PLACE}/${placeId.toString()}`;
      const response = await apiClient.get(url);
      setSummaryPlaceMarker(response);
      setEnabledMarkers(response.map((type) => type._id));
    } catch (error) {}
  };

  const fetchMarkerAdmin = async (placeId) => {
    try {
      const params = new URLSearchParams({
        placeId: placeId ?? "",
      });
      const url = `${ENDPOINT.GET_ALL_MARKER_ADMIN}?${params.toString()}`;
      const response = await apiClient.post(url, {
        markerTypeFilter: enabledMarkers,
      });

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
    if (!isAdmin) return;
    console.log(e);
    const { lat, lng } = e.latlng;

    setPointSelected([lat, lng]);
    const { community, comunity } = e.target.feature.properties; // Access the feature properties
    const zoneName = community || comunity; // Assuming 'community' is the zone name
    const zoneId = e.target.feature._id; // Access the feature ID
    setZoneSelected({
      zoneName: zoneName,
      zoneId: zoneId,
    });
    console.log(`Clicked on Zone: ${zoneName} (ID: ${zoneId})`);
  };

  const RenderMarker = ({ markers }) => {
    const getIcon = (iconUrl) => {
      console.log(iconUrl);
      if (!iconUrl) {
        // Return a default icon when iconUrl is missing
        return L.icon({
          iconUrl:
            "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
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
          return (
            <Marker
              key={marker._id}
              position={marker.geometry.coordinates}
              icon={getIcon(marker.properties?.markerType?.icon)}
            >
              <Popup>
                <div className="py-2">
                  ชื่อ : {marker.properties?.markerInfo.name}
                </div>
                <div className="py-2">
                  ประเภท : {marker.properties?.markerType?.name}
                </div>
                {/* <div>
                    ชื่อ - นามสกุล : {marker.properties?.users?.firstName}{" "}
                    {marker.properties?.users?.lastName}
                  </div>
                  <div>เพศ: {marker.properties?.users?.gender}</div>
                  <div>อายุ: {marker.properties?.users?.age}</div>
                  <div>ชุมชน : {marker.properties?.users?.zoneName}</div> */}
              </Popup>
            </Marker>
          );
        })}
      </>
    );
  };

  // fetch ข้อมูลประเภทหมุดแต่ละเมือง
  const fetchPinTypes = async (placeId) => {
    try {
      const url = `${ENDPOINT.GET_PLACE_MARKER_TYPE}/${placeId}`;
      const response = await apiClient.get(url);
      setPinTypes(response);
    } catch (error) {
      console.log("error", error);
    }
  };

  // method สำหรับ เพิ่มหมุด
  const handleAddMarker = async (values) => {
    console.log(values);
    const markerTypeName = values?.typeName;
    try {
      let bodyData = {};

      if (markerTypeName === MainMarkerTypeEnum.PLACES) {
        bodyData = {
          place: values.placeId,
          zone: values.zone,
          markerType: values.markerType,
          geometry: {
            type: "Point",
            coordinates: [
              parseFloat(values.longitude),
              parseFloat(values.latitude),
            ],
          },
          markerInfo: {
            name: values.name,
            description: values.description,
          },
          properties: {
            openingDate: values.openingDate,
            openingTime: values.openingTime,
          },
        };
      } else if (markerTypeName === MainMarkerTypeEnum.PERSON) {
        bodyData = {
          place: values.placeId,
          zone: values.zone,
          markerType: values.markerType,
          geometry: {
            type: "Point",
            coordinates: [
              parseFloat(values.longitude),
              parseFloat(values.latitude),
            ],
          },
          markerInfo: {
            name: values.name,
            description: "",
          },
          properties: {
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
        };
      }
      console.log(bodyData);

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
      const url = `${ENDPOINT.CREATE_MARKER}`;
      const body = bodyData;
      const response = await apiClient.post(url, body);

      if (isAdmin) {
        await Promise.allSettled([fetchMarkerAdmin(place?._id)]);
      } else {
        await Promise.allSettled([fetchMarkers(place?._id)]);
      }

      await fetchPlaceSummaryMarker(place?._id);
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
              <RenderMarker markers={markers} />

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
                      fillColor: "transparent",
                      fillOpacity: 0.5,
                    }}
                  />
                  <GeoJSON
                    key={`zone`}
                    data={place.zones.features}
                    style={{
                      color: "#f0ff",
                      weight: 1,
                      fillColor: "transparent",
                      fillOpacity: 0.5,
                    }}
                    onEachFeature={(feature, layer) => {
                      layer.on({
                        click: handleMapClick,
                      });
                    }}
                  />
                </React.Fragment>
              }
              {/* <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
              <TileLayer
                url="http://mt0.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                maxZoom={20}
              />
            </MapContainer>
          </div>
        </div>
        {/* ข้อมูลสรุปและข้อมูลตามชุมชน */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <MapLayerTwoSidebar
            place={place}
            isAdmin={isAdmin}
            setIsAdmin={setIsAdmin}
            summaryMarker={summaryPlaceMarker}
            setEnabledMarkers={setEnabledMarkers}
            enabledMarkers={enabledMarkers}
          />
        </div>
      </div>
      <ComponentGuard allowedRoles={[Role.ADMIN, Role.SUPER_ADMIN]}>
        <TableEditMarkerAdmin
          markers={markers}
          isAdmin={isAdmin}
          setModalMarkerIsVisible={setModalMarkerIsVisible}
          setModalEditMarkerIsVisible={setModalEditMarkerIsVisible}
          setSelectedRecord={setSelectedRecord}
          modalMarkerIsVisible={modalMarkerIsVisible}
          modalEditMarkerIsVisible={modalEditMarkerIsVisible}
          fetchData={fetchData}
        />
      </ComponentGuard>

      <ModalMarkerDetail
        visible={modalMarkerIsVisible}
        onCancel={() => setModalMarkerIsVisible(false)}
        data={selectedRecord}
      />
      <ModalEditMarkerDetail
        visible={modalEditMarkerIsVisible}
        onCancel={() => setModalEditMarkerIsVisible(false)}
        data={selectedRecord || null}
      />
      <ModalAddMarker
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(!isModalVisible)}
        data={pinTypes}
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
