import { useEffect, useState, useRef, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayerGroup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import styles from "@/components/map/tooltip.module.css";
import "@/components/map/leaflet.css";
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
import { useGlobalContext } from "@/context/Context";
import TableEditMarkerAdmin from "./MapLayerTwo/TableEditMarkerAdmin";
import MapLayerTwoSidebar from "./MapLayerTwo/MapLayerTwoSidebar";
import { useUser } from "@clerk/clerk-react";
import Role from "@/enum/role.enum";
import MainMarkerTypeEnum from "@/enum/main-marker-type";
import ComponentGuard from "@/routes/ComponentGuard";
import ModalEditMarkerDetail from "../modal/ModalEditMarker";
import ModalMaintainMarker from "../modal/ModalMaintainMarker";
import { useGlobalMapContext } from "@/context/MapContext";
import { useMarkerCreate } from "@/hooks/user-markers";
import { getLocationHandler } from "@/utils/utils";
import { FindMyLocationButton } from "./MapLayerTwo/FindMyLocationButton";
import { LocationMarker } from "./MapLayerTwo/LocationMarker";
import { FindMyPlace } from "./MapLayerTwo/FindMyPlaceButton";
import { RenderMarker } from "./MapLayerTwo/RenderMarker";
import { LayerControllerHandler } from "./MapLayerTwo/LayerController";
import { LayerChangeHandler } from "./MapLayerTwo/LayerController";

export default function MapLayerTwo() {
  const { checkIsAdminPlace, isLoaded } = useGlobalContext();
  const { placeSelected, markers, changeLayer, resetSelected } =
    useGlobalMapContext();
  const markerRef = useRef(null);
  const geoJsonLayerRef = useRef(null);

  const [isAdmin, setIsAdmin] = useState(
    checkIsAdminPlace(placeSelected?._id) || false
  );
  const [pointSelected, setPointSelected] = useState(
    isAdmin && placeSelected?.location?.coordinates
  );
  const [map, setMap] = useState(null);
  const [zoneSelected, setZoneSelected] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMarkerIsVisible, setModalMarkerIsVisible] = useState(false);
  const [modalEditMarkerIsVisible, setModalEditMarkerIsVisible] =
    useState(false);
  const [modalMaintainMarkerIsVisible, setModalMaintainMarkerIsVisible] =
    useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isLoadingLatLng, setIsLoadingLatLng] = useState(false);
  const [isLatLngError, setIsLatLngError] = useState(false);
  const [isTriggerReq, setIsTriggerReq] = useState(false);
  const [layerMap, setLayerMap] = useState("satellite");

  const { mutate: mutateMarkerCreate } = useMarkerCreate();
  const getLocation = () => {
    setIsTriggerReq(true);
    getLocationHandler({
      map,
      placeSelected,
      markerRef,
      setZoneSelected,
      setIsLatLngError,
      setIsLoadingLatLng,
      setPointSelected,
    });
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
            description: values.description,
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
        const zoneLayer = L.geoJSON(placeSelected?.zones);
        if (!zoneLayer.getBounds().contains(latlng)) {
          throw new Error(
            "The provided latitude and longitude are outside the zone."
          );
        }
      }
      const body = bodyData;
      // mutate and refetch
      mutateMarkerCreate(body);
      setIsModalVisible(!isModalVisible);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleView = (record) => {
    setSelectedRecord(record);
    setModalMarkerIsVisible(!modalMarkerIsVisible);
  };
  const changePlace = () => {
    resetSelected();
    changeLayer((prev) => !prev);
  };

  const handleMaintainView = (record) => {
    console.log("main tain nainn", record);
    setSelectedRecord(record);
    setModalMaintainMarkerIsVisible(!modalMaintainMarkerIsVisible);
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
                onClick={() => changePlace()}
              >
                <span>
                  <ArrowLeftOutlined /> เลือกเมือง
                </span>
              </div>
            </div>
            <div className="flex justify-center items-center w-1/3">
              <h2 className="text-xl font-bold text-gray-700 ">
                แผนที่ เมือง{placeSelected?.amphurName}
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
              center={placeSelected?.location?.coordinates}
              zoom={13}
              style={{ height: "600px", width: "100%" }}
              whenReady={(mapInstance) => setMap(mapInstance.target)}
            >
              {map && (
                <>
                  <FindMyLocationButton
                    map={map}
                    setPointSelected={setPointSelected}
                    zonesGeoJSON={placeSelected?.zones?.features}
                    markerRef={markerRef}
                  />
                  <FindMyPlace
                    map={map}
                    placeSelected={placeSelected}
                    markerRef={markerRef}
                  />
                </>
              )}
              <RenderMarker
                markers={markers}
                isAdmin={isAdmin}
                handleView={handleView}
                handleMaintainView={handleMaintainView}
              />
              <LayerChangeHandler
                setLayerMap={setLayerMap}
                geoJsonLayerRef={geoJsonLayerRef}
              />
              <LayerControllerHandler layerMap={layerMap} />
              <LocationMarker
                isAdmin={isAdmin}
                setIsModalVisible={setIsModalVisible}
                isModalVisible={isModalVisible}
                pointSelected={pointSelected}
              />
              {
                <React.Fragment key={`polygon`}>
                  <GeoJSON
                    key={`place`}
                    data={placeSelected?.place?.features}
                    style={{
                      color: "#0d39ff",
                      weight: 4,
                      fillColor: "transparent",
                      fillOpacity: 0.5,
                      // dashArray: "4 10",
                    }}
                  />
                  {/* show zone name */}
                  <GeoJSON
                    key={`zone-${layerMap}`}
                    data={placeSelected?.zones?.features}
                    style={(feature) => {
                      const color = feature.properties.color;
                      return {
                        color: "#0d39ff",
                        // color: "#fbff0f",
                        weight: 1,
                        fillColor: color ?? "transparent",
                        fillOpacity: 0.5,
                      };
                    }}
                    ref={geoJsonLayerRef}
                    onEachFeature={(feature, layer) => {
                      const tooltipText =
                        feature.properties?.Shot_Name ||
                        feature.properties?.community;

                      if (tooltipText) {
                        layer.bindTooltip(tooltipText, {
                          permanent: false, // Show on hover only
                          direction: "center",
                          interactive: false,
                          className:
                            layerMap !== "satellite"
                              ? styles.tooltipSatellite
                              : styles.tooltipRoadmap,
                        });

                        // Make sure tooltip only appears on hover
                        layer.on("mouseover", () => {
                          layer.openTooltip();
                        });

                        layer.on("mouseout", () => {
                          layer.closeTooltip();
                        });
                      }

                      // Optional: click handling
                      layer.on({
                        click: handleMapClick,
                      });
                    }}
                  />
                </React.Fragment>
              }
            </MapContainer>
          </div>
        </div>
        {/* ข้อมูลสรุปและข้อมูลตามชุมชน */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <MapLayerTwoSidebar />
        </div>
      </div>
      <ComponentGuard allowedRoles={[Role.ADMIN, Role.SUPER_ADMIN]}>
        <TableEditMarkerAdmin
          setModalMarkerIsVisible={setModalMarkerIsVisible}
          setModalEditMarkerIsVisible={setModalEditMarkerIsVisible}
          setSelectedRecord={setSelectedRecord}
          modalMarkerIsVisible={modalMarkerIsVisible}
          modalEditMarkerIsVisible={modalEditMarkerIsVisible}
        />
      </ComponentGuard>

      <ModalMarkerDetail
        visible={modalMarkerIsVisible}
        onCancel={() => setModalMarkerIsVisible(false)}
        data={selectedRecord}
      />
      <ModalMaintainMarker
        visible={modalMaintainMarkerIsVisible}
        onCancel={() => setModalMaintainMarkerIsVisible(false)}
        marker={selectedRecord}
      />
      <ModalEditMarkerDetail
        setModalEditMarkerIsVisible={setModalEditMarkerIsVisible}
        visible={modalEditMarkerIsVisible}
        onCancel={() => setModalEditMarkerIsVisible(false)}
        data={selectedRecord || null}
      />
      <ModalAddMarker
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(!isModalVisible)}
        handleOK={handleAddMarker}
        pointSelected={pointSelected}
        zoneSelected={zoneSelected}
        place={placeSelected}
        getLocation={getLocation}
        isLoadingLatLng={isLoadingLatLng}
        isLatLngError={isLatLngError}
        isTriggerReq={isTriggerReq}
        isAdmin={isAdmin}
      />
    </div>
  );
}
