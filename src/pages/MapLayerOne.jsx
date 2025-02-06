import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import thailandPolygon from "../components/data/thailand.json";
import { Select, Row, Col, Flex, Button } from "antd";
import { ENDPOINT } from "@/components/endpoint";

export default function ServiceAreaSelection() {
  const [regionList, setRegionList] = useState([]);
  const [regionSelected, setRegion] = useState(null);
  const [placeList, setPlaceList] = useState([]);
  const [placeSelected, setPlaceSelected] = useState();
  const [placePolygon, setPlacePolygon] = useState([]);
  const [provinceList, setProvinceList] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [flyToLatLng, setFlyToLatLng] = useState([]);
  const [clearTrigger, setClearTrigger] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await Promise.allSettled([
        fetchProvince(),
        fetchRegion(),
        fetchPlaces(),
        fetchPlacePolygon(),
      ]);
    };
    fetchData();
  }, []);

  //TODO: FETCH DROPDOWN

  const fetchProvince = async (geographyId) => {
    try {
      const params = new URLSearchParams(
        geographyId && { geographyId: geographyId }
      );
      const province = await fetch(
        `${ENDPOINT.GET_ALL_PROVINCE}?${params.toString()}`
      );
      const response = await province.json();
      setProvinceList(response);
    } catch (error) {
      console.error("ERROR FETCH PROVINCE:", error);
    }
  };
  const fetchRegion = async (geographyId) => {
    try {
      const region = await fetch(`${ENDPOINT.GET_ALL_GEOGRAPHY}`);
      const response = await region.json();
      setRegionList(response);
    } catch (error) {
      console.error("ERROR FETCH REGION:", error);
    }
  };
  const fetchPlaces = async (provinceId, geographyId) => {
    try {
      console.log(provinceId, geographyId);
      const params = new URLSearchParams({
        provinceId: provinceId ?? "",
        geographyId: geographyId ?? "",
      });
      console.log(params);

      const places = await fetch(
        `${ENDPOINT.GET_ALL_PLACE}?${params.toString()}`
      );
      const response = await places.json();
      setPlaceList(response.data ?? []);
    } catch (error) {
      console.error("ERROR FETCH PLACES:", error);
    }
  };
  const fetchPlacePolygon = async () => {
    try {
      const placePolygon = await fetch(ENDPOINT.GET_ALL_PLACE);
      const response = await placePolygon.json();
      setPlacePolygon(response.data ?? []);
    } catch (error) {
      console.error("ERROR FETCH PLACES:", error);
    }
  };
  const onChangeProvince = async (value) => {
    console.log(value);
    setClearTrigger(0);
    setRegion(value?.geography_id);
    setSelectedProvince(value);
    setFlyToLatLng([value?.latitude, value?.longitude]);
    await fetchPlaces(value?._id);
  };
  const onChangePlace = (value) => {
    console.log(value);
    setPlaceSelected({ ...value });
    setFlyToLatLng(value.location.coordinates);
  };
  const onChangeRegion = async (region) => {
    setSelectedProvince(null);
    setPlaceSelected(null);
    setRegion(region.id);
    await Promise.allSettled([
      fetchProvince(region.id),
      fetchPlaces(null, region.id),
    ]);
  };
  const onClearPlace = async () => {
    await fetchPlaces();
    setPlaceSelected(null);
    setRegion(null);
    setFlyToLatLng([13.885556744960699, 100.63529495228143]);
    setClearTrigger(1);
  };
  const onClearProvince = async () => {
    await Promise.allSettled([fetchProvince(), fetchPlaces()]);
    setSelectedProvince(null);
    setRegion(null);
    setFlyToLatLng([13.885556744960699, 100.63529495228143]);
    setClearTrigger(1);
  };

  const FlyToProvince = ({ position, zoom }) => {
    console.log("FLY POSITION", position);
    const map = useMap();

    if (position) {
      map.flyTo(position, zoom ?? 10, {
        duration: 1.5, // Animation duration in seconds
      });
    }

    return null;
  };
  const onSearch = (value) => {
    console.log("search:", value);
  };

  const handleConfirm = () => {
    if (selectedProvince) {
      navigate(`/dashboard?place=${selectedProvince}`);
    } else {
      alert("กรุณาเลือกพื้นที่ก่อนกดปุ่มยืนยัน");
    }
  };

  const handleMapClick = (e) => {
    const { NL_NAME_1 } = e.target.feature.properties;
    console.log(e.target.feature.properties);
    console.log(NL_NAME_1.slice(7));

    setSelectedProvince(NL_NAME_1.slice(7) ?? null);
  };

  return (
    <div className=" bg-gray-100  ">
      <Row gutter={20}>
        <Col xl={16} xs={0} md={24} order={1}>
          {/* <div className="map-section flex-grow h-[60vh] lg:h-[90vh] w-full lg:w-3/4 rounded-lg shadow-lg"> */}
          <div className="flex flex-col items-center h-[90vh]">
            <MapContainer
              center={[13.885556744960699, 100.63529495228143]}
              zoom={6}
              className="h-full w-full "
              scrollWheelZoom={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {thailandPolygon && (
                <GeoJSON
                  data={thailandPolygon}
                  onEachFeature={(feature, layer) => {
                    layer.on({
                      click: handleMapClick,
                    });
                  }}
                  style={{
                    color: "#555",
                    weight: 1,
                    fillColor: "#D6D6DA",
                    fillOpacity: 0.5,
                  }}
                />
              )}
              {placePolygon &&
                placePolygon.map((polygon, idx) => {
                  return (
                    <React.Fragment key={`polygon-${idx}`}>
                      <GeoJSON
                        key={`place-${idx}`}
                        data={polygon.place.features}
                        style={{
                          color: "#f0ff",
                          weight: 1,
                          fillColor: "#D6D6DA",
                          fillOpacity: 0.5,
                        }}
                      />
                      <GeoJSON
                        key={`zone-${idx}`}
                        data={polygon.zones.features}
                        style={{
                          color: "#f0ff",
                          weight: 1,
                          fillColor: "#D6D6DA",
                          fillOpacity: 0.5,
                        }}
                      />
                    </React.Fragment>
                  );
                })}

              {selectedProvince && (
                <>
                  <FlyToProvince position={flyToLatLng} />
                </>
              )}
              {placeSelected && (
                <>
                  <FlyToProvince position={flyToLatLng} zoom={13} />
                </>
              )}

              {/* {clearTrigger && (
                <FlyToProvince position={flyToLatLng} zoom={6} />
              )} */}
            </MapContainer>
          </div>
        </Col>
        <Col
          xl={8}
          md={24}
          order={2}
          className="flex flex-col justify-center items-center"
        >
          <Row justify={"center"} wrap>
            <Col>
              <h1 className="text-2xl font-bold mb-4">
                เลือกพื้นที่ที่จะใช้บริการ
              </h1>
              <Flex gap="small" wrap className="mb-2">
                {regionList.map((region) => (
                  <Button
                    type={regionSelected === region.id ? "primary" : "default"}
                    key={region.id}
                    onClick={(e) => onChangeRegion(region)}
                  >
                    {region.name}
                  </Button>
                ))}
              </Flex>
              <Flex gap={5}>
                <div>
                  <Select
                    notFoundContent="ไม่มีข้อมูลจังหวัด"
                    showSearch
                    placeholder="เลือกจังหวัดของคุณ"
                    optionFilterProp="label"
                    allowClear={true}
                    onClear={onClearProvince}
                    className="min-w-40"
                    onChange={(value) => {
                      if (value) {
                        const provinceObj = provinceList.find(
                          (province) => province._id === value
                        );
                        onChangeProvince(provinceObj);
                      }
                    }}
                    value={selectedProvince?._id ?? null}
                    onSearch={onSearch}
                    options={provinceList.map((province) => {
                      return {
                        label: province.name_th,
                        value: province._id,
                      };
                    })}
                  />
                </div>
                <div>
                  <Select
                    showSearch
                    notFoundContent="ไม่มีข้อมูลเมือง"
                    placeholder="เลือกเมืองของคุณ"
                    optionFilterProp="label"
                    allowClear={true}
                    onClear={onClearPlace}
                    className="min-w-40"
                    onChange={(value) => {
                      if (value) {
                        const placeObj = placeList.find(
                          (place) => place._id === value
                        );
                        onChangePlace(placeObj);
                      }
                    }}
                    value={placeSelected?._id ?? null}
                    onSearch={onSearch}
                    options={placeList.map((place) => {
                      return {
                        label: place.municipalityName,
                        value: place._id,
                      };
                    })}
                  />
                </div>
              </Flex>
              <div className={`text-center my-4`}>
                <button
                  className={`${
                    placeSelected
                      ? "bg-black text-white cursor-pointer"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  } px-7 py-1`}
                  onClick={handleConfirm}
                  disabled={!placeSelected}
                >
                  ยืนยัน
                </button>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
