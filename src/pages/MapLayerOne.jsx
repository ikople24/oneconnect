import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import thailandPolygon from "../components/data/thailand.json";
import { Select, Row, Col, Flex, Button } from "antd";
import thailandProvinceList from "@/components/data/provinces.json";
import regionThailand from "@/components/data/region.json";
import { ENDPOINT } from "@/components/endpoint";
// import logo from "../assets/logo.png";

export default function ServiceAreaSelection() {
  const [regionList, setRegionList] = useState([]);
  const [regionSelected, setRegion] = useState(null);
  const [provinceList, setProvinceList] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [flyToLatLng, setFlyToLatLng] = useState([]);
  const [clearTrigger, setClearTrigger] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setRegionList(regionThailand);
    setProvinceList(thailandProvinceList);
  }, []);
  const onChangeProvince = (value) => {
    if (value) {
      console.log(`selected ${value}`);
      setClearTrigger(0);
      setRegion(value.geography_id);
      setSelectedProvince(value.name_th);
      setFlyToLatLng([value.latitude, value.longitude]);
    }
  };
  const onClearProvince = () => {
    setSelectedProvince(null);
    setRegion(null);
    setFlyToLatLng([13.885556744960699, 100.63529495228143]);
    setClearTrigger(1);
  };
  const FlyToProvince = ({ position, zoom }) => {
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

  const onChangeRegion = (region) => {
    const provinceTmp = [...thailandProvinceList];

    setRegion(region.id);
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
              {selectedProvince && <FlyToProvince position={flyToLatLng} />}
              {clearTrigger && (
                <FlyToProvince position={flyToLatLng} zoom={6} />
              )}
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
              <div>
                <Select
                  showSearch
                  placeholder="เลือกจังหวัดของคุณ"
                  optionFilterProp="label"
                  allowClear={true}
                  onClear={onClearProvince}
                  onChange={(value) => {
                    const selectedProvince = thailandProvinceList.find(
                      (province) => province.id === value
                    );
                    onChangeProvince(selectedProvince); // Pass the full object here
                  }}
                  value={selectedProvince ?? null}
                  onSearch={onSearch}
                  options={provinceList.map((province) => {
                    return {
                      label: province.name_th,
                      value: province.id,
                    };
                  })}
                />
              </div>

              <div className={`text-center my-4`}>
                <button
                  className={`${
                    selectedProvince
                      ? "bg-black text-white cursor-pointer"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  } px-7 py-1`}
                  onClick={handleConfirm}
                  disabled={!selectedProvince}
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
