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
import { Space, Button, Table, Tooltip, Modal, message } from "antd";
import { GeoJSON, useMapEvent, LayersControl } from "react-leaflet";
import { ENDPOINT } from "../endpoint";
import { SwitchMode } from "../admin/SwitchMode";
import ModalAddMarker from "../modal/ModalAddMarker";
import * as L from "leaflet";
export default function MapLayerTwo(props) {
  const { place } = props;
  const [pointSelected, setPointSelected] = useState(
    place?.location?.coordinates
  );
  const [zoneSelected, setZoneSelected] = useState();
  const [markers, setMaker] = useState([]);
  const [isAdmin, setIsAdmin] = useState(0);
  const [pinTypes, setPinTypes] = useState([]);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // TODO:: สำหรับตาราง admin
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  });
  const [modalMarkerIsvisible, setModalMarkerIsvisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

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
    fetchData();
  }, [isAdmin]);

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
      iconUrl: "https://cdn-icons-png.flaticon.com/512/14090/14090313.png",
      iconSize: [40, 40],
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

  // TODO:: สำรหับตาราง Table
  const handleView = (record) => {
    console.log("ดูรายละเอียด", record);
    setSelectedRecord(record);
    setModalMarkerIsvisible(!modalMarkerIsvisible);
  };

  const deleteMarker = async (id) => {
    return await fetch(`${ENDPOINT.DELETE_MARKER_ADMIN}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const handleDelete = (record) => {
    console.log("ลบ", record);
    Modal.confirm({
      title: "คุณแน่ใจไหม?",
      content: "หากคุณลบข้อมูลนี้จะไม่สามารถกู้คืนได้",
      okText: "ใช่",
      cancelText: "ยกเลิก",
      async onOk() {
        const { _id } = record;
        try {
          await deleteMarker(_id);

          message.success({
            content: "ลบข้อมูลสำเร็จ!",
            duration: 3,
          });
        } catch (error) {
          message.error({
            content: error.message || "เกิดข้อผิดพลาดในการลบข้อมูล",
            duration: 3,
          });
        }
      },
      onCancel() {
        console.log("ยกเลิกการลบ");
      },
    });
  };

  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "index",
      key: "index",
      align: "center",
      width: 100,
      render: (text, record, index) => index + 1,
    },
    {
      title: "ชื่อข้อมูล",
      dataIndex: ["properties", "name"],
      key: "name",
      align: "center",
      width: 200,
    },
    {
      title: "ประเภทข้อมูล",
      dataIndex: ["properties", "markerType"],
      key: "markerType",
      align: "center",
      width: 200,
    },
    {
      title: "แอคชั่น",
      key: "action",
      align: "center",
      width: 200,
      render: (text, record) => (
        <Space>
          <Tooltip title="ดูรายละเอียด" open={false}>
            <Button
              type="primary"
              shape="circle"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="ลบ" open={false}>
            <Button
              color="danger"
              variant="solid"
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* แผนที่ */}
        <div className="lg:col-span-2 bg-white shadow-lg rounded-lg p-6 relative">
          <div className="flex justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-700 mb-4">
                แผนที่ เมือง{place.amphurName}
              </h2>
            </div>
            <div>
              <Button
                type="primary"
                size=""
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
              // onClick={handleMapClick}
            >
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
      {/*  ตาราง แสดงข้อมูล Admin  */}
      <div>
        <Table
          columns={columns}
          dataSource={markers}
          rowKey="_id"
          pagination={tableParams.pagination}
          scroll={{ x: "max-content" }}
        />
      </div>
      {/* Modal Marker Detail in Table */}
      <ModalMarkerDetail
        visible={modalMarkerIsvisible}
        onCancel={() => setModalMarkerIsvisible(false)}
        data={selectedRecord}
      />
      {/* Modal */}
      <ModalAddMarker
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(!isModalVisible)}
        data={pinTypes[0]}
        handleOK={handleAddMarker}
        pointSelected={pointSelected}
        zoneSelected={zoneSelected}
        place={place}
      />
    </div>
  );
}
