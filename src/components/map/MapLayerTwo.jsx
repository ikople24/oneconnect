import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";
import { Button } from "antd";
import { GeoJSON, useMapEvent, LayersControl } from "react-leaflet";
import { ENDPOINT } from "../endpoint";
import ModalAddMarker from "../modal/ModalAddMarker";
export default function MapLayerTwo(props) {
  const { place } = props;
  const [markers, setMaker] = useState([]);
  const [pinTypes, setPinTypes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    console.log(place);
    const fetchData = async () => {
      await Promise.allSettled([fetchMarkers(place?._id), fetchPinTypes(place?._id)]);
    };
    fetchData();
  }, []);
  const fetchMarkers = async (placeId) => {
    try {
      console.log(placeId);
      const params = new URLSearchParams({
        placeId: placeId ?? "",
      });
      console.log(params);

      const markers = await fetch(
        `${ENDPOINT.GET_MARKERS}?${params.toString()}`
      );
      const response = await markers.json();
      console.log(response);

      setMaker(response ?? []);
    } catch (error) {
      console.error(error);
    }
  };
  const [summary, setSummary] = useState({ elderly_count: 150 });

  const LocationMarker = () => {
    useMapEvent("click", (e) => {
      console.log("Clicked coordinates:", e.latlng);
    });
  };
  const handleMapClick = (e) => {
    const { community } = e.target.feature.properties;
    const zoneName = community;
    const zoneId = e.target.feature._id;
  };

  const LayerControllerFilterHandler = (type) => {
    const markerTypeFilter = markers.filter(
      (marker) => marker.properties.markerType === type
    );
    const markerInLayer = markerTypeFilter.map((marker) => {
      return (
        <Marker
          key={marker._id}
          position={marker.geometry.coordinates}
        >
          <Popup>{marker.properties.name}</Popup>
        </Marker>
      );
    });
    return markerInLayer;
  };

  // fetch ข้อมูลประเภทหมุดแต่ละเมือง
  const fetchPinTypes = async(placeId) => {
    try {
      const params = new URLSearchParams({
        placeId: placeId ?? "",
      });
      const response = await fetch(`${ENDPOINT.GET_ALL_PINTYPES}?${params?.toString()}`);
      
      if (!response.ok){
        console.log('Can not fetch :: pinTypes');
      }

      const data = await response.json();
      setPinTypes(data);
    } catch (error) {
      console.log('error', error)
    }
  }

  // method สำหรับ เพิ่มหมุด
  const handleAddMarker = async(values) => {
    try {
      const bodyData = {
        geometry: {
          type: "Point",
          coordinates: [
            parseFloat(values.longitude), 
            parseFloat(values.latitude)
          ]
        },
        properties: {
          name: values.firstName + " " + values.lastName, 
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
            placeId: values.placeId,
            zoneId: values.zoneId
          }
        }
      };
      const response = await fetch(`${ENDPOINT.CREATE_MARKER}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.log('error', error);
    }
  }

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
              <Button type="primary" size="">
                ปักหมุดแผนที่
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-200 relative">
            <MapContainer
              center={place?.location?.coordinates}
              zoom={13}
              style={{ height: "600px", width: "100%" }}
            >
              <LayersControl position="topright">
                {place.pinTypes.map((type, idx) => {
                  return (
                    <LayersControl.Overlay key={idx} name={type} checked > 
                      {LayerControllerFilterHandler(type)}
                    </LayersControl.Overlay>
                  );
                })}
              </LayersControl>
              <LocationMarker />
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
        data={pinTypes}
        handleOK={handleAddMarker}
      />
    </div>
  );
}
