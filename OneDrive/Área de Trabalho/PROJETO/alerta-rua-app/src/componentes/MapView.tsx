import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Alert, alertTypeConfig } from '../tipos/alert';
import { useEffect } from 'react';

// Ajuste para os ícones não sumirem no build do Cloudflare
const customIcon = (icon: string) => L.divIcon({
  html: `<div style="font-size: 24px; filter: drop-shadow(0 0 4px black)">${icon}</div>`,
  className: 'custom-icon',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

function LocationHandler() {
  const map = useMap();
  useEffect(() => {
    map.locate().on("locationfound", (e) => {
      map.setView(e.latlng, 15);
    });
  }, [map]);
  return null;
}

export default function MapView({ alerts }: { alerts: Alert[] }) {
  return (
    <div className="w-full h-full bg-[#0a0a0a] z-0">
      <MapContainer 
        center={[-23.5505, -46.6333]} 
        zoom={13} 
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO'
        />
        <LocationHandler />
        {alerts.map((alert) => (
          <Marker 
            key={alert.id} 
            position={[alert.location.lat, alert.location.lng]}
            icon={customIcon(alertTypeConfig[alert.type].icon)}
          >
            <Popup>
              <div className="p-1">
                <p className="font-bold">{alertTypeConfig[alert.type].label}</p>
                <p className="text-xs">{alert.location.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}