"use client";

import * as React from "react";

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  popup: React.ReactNode;
  onClick?: () => void;
}

interface LeafletMapProps {
  center: [number, number];
  zoom: number;
  markers: MapMarker[];
  height?: string;
}

function MapContent({ center, zoom, markers, height }: LeafletMapProps) {
  const [mapReady, setMapReady] = React.useState(false);
  const [Components, setComponents] = React.useState<{
    MapContainer: any;
    TileLayer: any;
    Marker: any;
    Popup: any;
  } | null>(null);

  React.useEffect(() => {
    // Load CSS first
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Then load JS
    import("leaflet").then((L) => {
      // Fix marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });

      return import("react-leaflet");
    }).then((RL) => {
      setComponents({
        MapContainer: RL.MapContainer,
        TileLayer: RL.TileLayer,
        Marker: RL.Marker,
        Popup: RL.Popup,
      });
      setMapReady(true);
    }).catch((err) => {
      console.error("Failed to load map libraries:", err);
    });
  }, []);

  if (!mapReady || !Components) {
    return (
      <div
        className="w-full bg-muted animate-pulse rounded-lg flex items-center justify-center"
        style={{ height: height || "600px" }}
      >
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = Components;

  return (
    <MapContainer
      key={`map-${center[0]}-${center[1]}-${zoom}`}
      center={center}
      zoom={zoom}
      style={{ height: height || "600px", width: "100%", background: "#e5e7eb" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.lat, marker.lng]}
          eventHandlers={marker.onClick ? { click: marker.onClick } : {}}
        >
          <Popup>{marker.popup}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export function LeafletMap(props: LeafletMapProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div
        className="w-full bg-muted animate-pulse rounded-lg flex items-center justify-center"
        style={{ height: props.height || "600px" }}
      >
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return <MapContent {...props} />;
}

export default LeafletMap;
