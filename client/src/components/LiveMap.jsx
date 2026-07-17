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

export default function LiveMap({ order, liveLocation }) {
  // Custom delivery truck icon
  const truckIcon = new L.Icon({
    iconUrl: iconsForLeafpad.truck,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });

  // Destination pin icon
  const destinationIcon = new L.Icon({
    iconUrl: iconsForLeafpad.destination,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const isDeliveredOrCancelled =
    order?.status === "Delivered" || order?.status === "Cancelled";

  if (isDeliveredOrCancelled) return null;

  const hasLiveLocation = Boolean(liveLocation?.lat && liveLocation?.lng);
  const hasShippingCoordinates = Boolean(
    order?.shippingAddress?.lat && order?.shippingAddress?.lng
  );

  return (
    <div className="rounded-2xl overflow-hidden border border-black/20 h-[280px]">
      {hasLiveLocation ? (
        <MapContainer
          center={[liveLocation.lat, liveLocation.lng]}
          zoom={15}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          <Marker
            position={[liveLocation.lat, liveLocation.lng]}
            icon={truckIcon}
          >
            <Popup>Delivery Partner</Popup>
          </Marker>

          {hasShippingCoordinates && (
            <Marker
              position={[
                order.shippingAddress.lat,
                order.shippingAddress.lng,
              ]}
              icon={destinationIcon}
            >
              <Popup>Delivery Address</Popup>
            </Marker>
          )}

          <MapUpdater center={[liveLocation.lat, liveLocation.lng]} />
        </MapContainer>
      ) : hasShippingCoordinates ? (
        <MapContainer
          center={[order.shippingAddress.lat, order.shippingAddress.lng]}
          zoom={15}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker
            position={[
              order.shippingAddress.lat,
              order.shippingAddress.lng,
            ]}
            icon={destinationIcon}
          >
            <Popup>Delivery Address</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <div className="h-full bg-app-green/5 flex items-center justify-center">
          <div className="text-center">
            <MapPinIcon className="size-8 text-app-green/40 mx-auto mb-2" />
            <p className="text-sm text-app-green/50 font-medium">
              Waiting for delivery partner location...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}