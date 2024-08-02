// src/MapComponent.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const vehicleIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/252/252025.png',
  iconSize: [38, 38],
});

const MapComponent = () => {
  const [vehicleData, setVehicleData] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/vehicle');
        const data = response.data;
        setVehicleData(data);
        setCurrentPosition(data[data.length - 1]);
      } catch (error) {
        console.error('Error fetching vehicle data', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <MapContainer center={[17.385044, 78.486671]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {currentPosition && (
        <Marker position={[currentPosition.latitude, currentPosition.longitude]} icon={vehicleIcon} />
      )}
      <Polyline positions={vehicleData.map(({ latitude, longitude }) => [latitude, longitude])} color="blue" />
    </MapContainer>
  );
};

export default MapComponent;


