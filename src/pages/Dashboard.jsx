import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom"; // Import Link for navigation
import "leaflet/dist/leaflet.css";

const center = {
  lat: 13.736717, // ค่าเริ่มต้นของแผนที่ (กรุงเทพฯ)
  lng: 100.523186,
};

export default function Dashboard() {
  const [summary, setSummary] = useState({ elderly_count: 150 });
  const [communities, setCommunities] = useState([
    { id: 1, name: "ชุมชน A", elderly_count: 50 },
    { id: 2, name: "ชุมชน B", elderly_count: 60 },
    { id: 3, name: "ชุมชน C", elderly_count: 40 },
  ]);
  const [markers, setMarkers] = useState([
    { id: 1, lat: 13.736717, lng: 100.523186, name: "ชุมชน A" },
    { id: 2, lat: 13.745, lng: 100.534, name: "ชุมชน B" },
    { id: 3, lat: 16.449162, lng: 100.515, name: "ชุมชน C" },
    { id: 4, lat: 16.4491624, lng: 102.8421862, name: "testing" },
  ]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white shadow-lg rounded-lg p-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-700">แผนที่</h2>
            <Link to="/markerinformation" className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg">
              ปักหมุดคนเมือง
            </Link>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-200 relative">
            <MapContainer center={center} zoom={12} style={{ height: "600px", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {markers.map((marker) => (
                <Marker key={marker.id} position={[marker.lat, marker.lng]}>
                  <Popup className="font-semibold">{marker.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
        {/* ข้อมูลสรุปและข้อมูลตามชุมชน */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-700">ข้อมูลสรุป</h2>
          <p className="text-gray-600 text-lg">จำนวนผู้สูงอายุในระบบ: <span className="font-semibold text-blue-600">{summary.elderly_count}</span></p>
          <h2 className="text-xl font-bold text-gray-700 mt-4">ข้อมูลตามชุมชน</h2>
          <ul className="space-y-3 mt-2">
            {communities.map((community) => (
              <li key={community.id} className="p-3 bg-gray-50 rounded-md border border-gray-300">
                <span className="font-semibold text-gray-800">{community.name}</span>: 
                <span className="text-blue-600 font-medium"> {community.elderly_count} คน</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
