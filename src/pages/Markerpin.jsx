import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import thailandPolygon from "../components/data/thailand.json";
import { Select } from "antd";
import thailandProvinceList from "../components/data/provinces.json";
// import logo from "../assets/logo.png";

const geoUrl = "/custom.geo.json";

export default function ServiceAreaSelection() {
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch("http://localhost:3000/places");
        if (!response.ok) throw new Error("Failed to fetch places");
        const result = await response.json();

        if (result.data) {
          const uniqueProvinceNames = [
            ...new Set(
              Array.isArray(result.data)
                ? result.data.map((place) => place.provinceName)
                : [result.data.provinceName]
            ),
          ];
          setPlaces(uniqueProvinceNames);
        } else {
          console.error("Unexpected API response format:", result);
          setPlaces([]);
        }
      } catch (error) {
        console.error("Error fetching places:", error);
        setPlaces([]);
      }
    };

    const fetchGeoData = async () => {
      try {
        const response = await fetch(geoUrl);
        if (!response.ok) throw new Error("Failed to load geoJSON");
        const data = await response.json();
        setGeoData(data);
      } catch (error) {
        console.error("Error loading geoJSON:", error);
      }
    };

    fetchPlaces();
    fetchGeoData();
  }, []);
  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log("search:", value);
  };

  // const handleConfirm = () => {
  //   if (selectedPlace) {
  //     navigate(`/dashboard?place=${selectedPlace}`);
  //   } else {
  //     alert("กรุณาเลือกพื้นที่ก่อนกดปุ่มยืนยัน");
  //   }
  // };

  const handleMapClick = (e) => {
    console.log(e.latlng);
    const { properties } = e?.layer?.feature;

    console.log(properties);

    setSelectedPlace(properties.name);
  };

  return (
    <div className="justify-center min-h-screen bg-gray-100 p-6">
      <div className="container flex flex-col lg:flex-row items-center gap-4 w-full">
        {/* Map Section */}
        <div className="map-section flex-grow h-[70vh] lg:h-[90vh] w-full lg:w-3/4 rounded-lg shadow-lg">
          <MapContainer
            center={[13.885556744960699, 100.63529495228143]}
            zoom={6}
            className="h-full w-full"
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
          </MapContainer>
        </div>

        {/* Dropdown Section */}
        <div className="dropdown-section w-full lg:w-2/4 text-center px-4 lg:px-0 py-6 ml-4">
          {/* <img src={logo} alt="logo" className="w-20 mx-auto" /> */}
          <h1 className="text-2xl font-bold mb-4">
            เลือกพื้นที่ที่จะใช้บริการ
          </h1>

          <Select
            showSearch
            placeholder="เลือกพื้นที่ของคุณ"
            optionFilterProp="label"
            onChange={onChange}
            onSearch={onSearch}
            options={thailandProvinceList.map((province) => {
              return {
                label: province.name_th,
                value: province.name_th,
              };
            })}
          />

          {/* <Select onValueChange={(value) => setSelectedPlace(value)}>
            <SelectTrigger className="w-full lg:w-72 h-14 text-lg mx-auto">
              <SelectValue placeholder="เลือกพื้นที่ของคุณ" />
            </SelectTrigger>
            <SelectContent>
              {thailandProvinceList.length > 0 ? (
                thailandProvinceList.map((place, index) => (
                  <SelectItem key={index} value={place.name_th}>
                    {place.name_th}
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled>ไม่พบพื้นที่</SelectItem>
              )}
            </SelectContent>
          </Select> */}
          {/* <button
            className={`mt-8 w-full lg:w-72 h-14 px-4 py-4 text-lg text-center rounded-md shadow-lg ${
              selectedPlace
                ? "bg-black text-white cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleConfirm}
            disabled={!selectedPlace}
          >
            ยืนยัน
          </button> */}
        </div>
      </div>
    </div>
  );
}
