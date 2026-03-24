"use client";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Leaflet marker icon fix
const icon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface PetMapProps {
  lat: number;
  lng: number;
  shelterName: string;
  address: string;
}

export default function PetMap({ lat, lng, shelterName, address }: PetMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div style={{
        width: "100%",
        height: "300px",
        background: "var(--color-surface-2)",
        borderRadius: "var(--radius-lg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--color-text-muted)",
        fontSize: "0.85rem",
      }}>
        Loading map...
      </div>
    );
  }

  return (
    <div style={{ height: "300px", width: "100%", overflow: "hidden", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)" }}>
      <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={icon}>
          <Popup>
            <div style={{ padding: "4px" }}>
              <p style={{ fontWeight: 700, margin: 0 }}>{shelterName}</p>
              <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "gray" }}>{address}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
