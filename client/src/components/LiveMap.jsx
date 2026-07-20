import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { MapPinIcon } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { iconsForLeafpad } from "../assets/assets";

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

export default function LiveMap({ order }) {
  const currentOrder = Array.isArray(order) ? order[0] : order;

  const shipping = Array.isArray(currentOrder?.shippingAddress)
    ? currentOrder?.shippingAddress[0]
    : currentOrder?.shippingAddress;

  const homeIcon = new L.Icon({
    iconUrl: iconsForLeafpad.home || iconsForLeafpad.destination,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });

  const homeLat = Number(shipping?.lat);
  const homeLng = Number(shipping?.lng);
  const hasHomeCoordinates = Boolean(!isNaN(homeLat) && !isNaN(homeLng) && homeLat !== 0 && homeLng !== 0);

  return (
    <div className="rounded-2xl overflow-hidden border border-black/20 h-[280px]">
      {hasHomeCoordinates ? (
        <MapContainer
          center={[homeLat, homeLng]}
          zoom={15}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Marker position={[homeLat, homeLng]} icon={homeIcon}>
            <Popup>My Home Address</Popup>
          </Marker>

          <MapUpdater center={[homeLat, homeLng]} />
        </MapContainer>
      ) : (
        <div className="h-full bg-app-green/5 flex items-center justify-center">
          <div className="text-center">
            <MapPinIcon className="size-8 text-app-green/40 mx-auto mb-2" />
            <p className="text-sm text-app-green/50 font-medium">
              Waiting for home address location...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}