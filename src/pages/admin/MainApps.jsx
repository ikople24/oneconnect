import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MainApps = () => {
  const [data, setData] = useState({
    officers: 0,
    communityLeaders: 0,
    citizens: 0,
  });

  const [mapCenter, setMapCenter] = useState([13, 100]);
  const [markerPosition, setMarkerPosition] = useState([13, 100]);

  useEffect(() => {
    // Fetch data from API or other sources
    // This is just an example, replace with actual data fetching logic
    setData({
      officers: 10,
      communityLeaders: 5,
      citizens: 100,
    });
  }, []);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const newLatLng = [e.latlng.lat, e.latlng.lng];
        setMapCenter(newLatLng);
        setMarkerPosition(newLatLng);
      },
    });
    return null;
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">จำนวนเจ้าหน้าที่</h2>
          <p className="text-2xl">{data.officers}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">จำนวนผู้นำชุมชน</h2>
          <p className="text-2xl">{data.communityLeaders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">จำนวนประชาชน</h2>
          <p className="text-2xl">{data.citizens}</p>
        </div>
      </div>
      <MapContainer center={mapCenter} zoom={13} style={{ height: "400px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={markerPosition}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        <MapClickHandler />
      </MapContainer>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Marker Position</h2>
        <p>Latitude: {markerPosition[0]}</p>
        <p>Longitude: {markerPosition[1]}</p>
      </div>
    </div>
  );
};

export default MainApps;