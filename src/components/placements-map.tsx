"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, Users, X, ZoomIn, ZoomOut } from "lucide-react";
import {
  ALL_DATA,
  PLACEMENTS,
  OPENINGS,
  INDUSTRY_INFO,
  getRegionStats,
  type Placement,
} from "@/data/placements";

// Cluster data by region
interface RegionCluster {
  id: string;
  lat: number;
  lng: number;
  city: string;
  state: string;
  items: Placement[];
}

function clusterByRegion(data: Placement[]): RegionCluster[] {
  const clusters: Record<string, RegionCluster> = {};

  for (const item of data) {
    const key = `${item.city}-${item.state}`;

    if (!clusters[key]) {
      clusters[key] = {
        id: key,
        lat: item.lat,
        lng: item.lng,
        city: item.city,
        state: item.state,
        items: [],
      };
    }
    clusters[key].items.push(item);
  }

  return Object.values(clusters);
}

// Stats panel component
function StatsPanel({
  cluster,
  onClose,
  onZoomIn,
}: {
  cluster: RegionCluster;
  onClose: () => void;
  onZoomIn: () => void;
}) {
  const stats = getRegionStats(cluster.items);
  const placements = cluster.items.filter((i) => i.type === "placement").length;
  const openings = cluster.items.filter((i) => i.type === "opening").length;

  return (
    <Card className="absolute top-4 right-4 z-[1000] w-80 shadow-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {cluster.city}, {cluster.state}
          </CardTitle>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4 text-green-600" />
            {placements} placements
          </span>
          <span className="flex items-center gap-1">
            <Briefcase className="h-4 w-4 text-blue-600" />
            {openings} openings
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase">
          Industry Breakdown
        </p>
        {stats.map((stat) => (
          <div key={stat.industry} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: stat.color }}
              />
              <span className="text-sm">{stat.name}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium">{stat.percent}%</span>
              <span className="text-xs text-muted-foreground ml-2">
                ~${Math.round(stat.avgSalary / 1000)}k avg
              </span>
            </div>
          </div>
        ))}
        <Button onClick={onZoomIn} className="w-full mt-4" size="sm">
          <ZoomIn className="h-4 w-4 mr-2" />
          View Individual Jobs
        </Button>
      </CardContent>
    </Card>
  );
}

// Individual job panel
function JobPanel({
  items,
  city,
  state,
  onClose,
  onZoomOut,
}: {
  items: Placement[];
  city: string;
  state: string;
  onClose: () => void;
  onZoomOut: () => void;
}) {
  return (
    <Card className="absolute top-4 right-4 z-[1000] w-96 max-h-[80vh] overflow-hidden shadow-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {city}, {state}
          </CardTitle>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <Button variant="outline" size="sm" onClick={onZoomOut} className="w-fit">
          <ZoomOut className="h-4 w-4 mr-2" />
          Back to Overview
        </Button>
      </CardHeader>
      <CardContent className="overflow-y-auto max-h-[60vh] space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-lg border ${
              item.type === "opening"
                ? "border-blue-200 bg-blue-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.company}</p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded ${
                  item.type === "opening"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {item.type === "opening" ? "Open" : "Filled"}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span
                className="px-2 py-0.5 rounded"
                style={{
                  backgroundColor: `${INDUSTRY_INFO[item.industry]?.color}20`,
                  color: INDUSTRY_INFO[item.industry]?.color,
                }}
              >
                {INDUSTRY_INFO[item.industry]?.name}
              </span>
              <span className="font-medium">
                ${item.salary.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// The actual map component using react-leaflet
function LeafletMap({
  clusters,
  zoomedCity,
  zoomedItems,
  mapCenter,
  mapZoom,
  onClusterClick,
}: {
  clusters: RegionCluster[];
  zoomedCity: string | null;
  zoomedItems: Placement[];
  mapCenter: [number, number];
  mapZoom: number;
  onClusterClick: (cluster: RegionCluster) => void;
}) {
  const [leafletLoaded, setLeafletLoaded] = React.useState(false);
  const [LeafletComponents, setLeafletComponents] = React.useState<any>(null);

  React.useEffect(() => {
    // Dynamically import Leaflet components
    Promise.all([
      import("react-leaflet"),
      import("leaflet"),
    ]).then(([reactLeaflet, L]) => {
      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });

      setLeafletComponents({
        MapContainer: reactLeaflet.MapContainer,
        TileLayer: reactLeaflet.TileLayer,
        Marker: reactLeaflet.Marker,
        Popup: reactLeaflet.Popup,
        useMap: reactLeaflet.useMap,
      });
      setLeafletLoaded(true);
    });
  }, []);

  if (!leafletLoaded || !LeafletComponents) {
    return (
      <div className="w-full h-[600px] bg-muted animate-pulse rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = LeafletComponents;

  return (
    <MapContainer
      key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`}
      center={mapCenter}
      zoom={mapZoom}
      className="w-full h-[600px]"
      style={{ background: "#f0f0f0" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {!zoomedCity &&
        clusters.map((cluster) => {
          const placements = cluster.items.filter((i) => i.type === "placement").length;
          const openings = cluster.items.filter((i) => i.type === "opening").length;

          return (
            <Marker
              key={cluster.id}
              position={[cluster.lat, cluster.lng]}
              eventHandlers={{
                click: () => onClusterClick(cluster),
              }}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-medium">
                    {cluster.city}, {cluster.state}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {placements} placements, {openings} openings
                  </p>
                  <p className="text-xs mt-1">Click marker for details</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

      {zoomedCity &&
        zoomedItems.map((item) => (
          <Marker key={item.id} position={[item.lat, item.lng]}>
            <Popup>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm">{item.company}</p>
                <p className="text-sm text-muted-foreground">
                  ${item.salary.toLocaleString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}

export function PlacementsMap() {
  const [selectedCluster, setSelectedCluster] = React.useState<RegionCluster | null>(null);
  const [zoomedCity, setZoomedCity] = React.useState<string | null>(null);
  const [mapCenter, setMapCenter] = React.useState<[number, number]>([39.8283, -98.5795]);
  const [mapZoom, setMapZoom] = React.useState(4);

  const clusters = React.useMemo(() => clusterByRegion(ALL_DATA), []);

  const handleClusterClick = (cluster: RegionCluster) => {
    setSelectedCluster(cluster);
    setZoomedCity(null);
  };

  const handleZoomIn = () => {
    if (selectedCluster) {
      setMapCenter([selectedCluster.lat, selectedCluster.lng]);
      setMapZoom(12);
      setZoomedCity(`${selectedCluster.city}-${selectedCluster.state}`);
    }
  };

  const handleZoomOut = () => {
    setMapCenter([39.8283, -98.5795]);
    setMapZoom(4);
    setZoomedCity(null);
    setSelectedCluster(null);
  };

  const handleClose = () => {
    setSelectedCluster(null);
    setZoomedCity(null);
  };

  // Get items for zoomed city
  const zoomedItems = zoomedCity
    ? clusters.find((c) => `${c.city}-${c.state}` === zoomedCity)?.items || []
    : [];

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden border">
      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-background/95 backdrop-blur p-3 rounded-lg shadow-lg">
        <p className="text-xs font-medium mb-2">Legend</p>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>{PLACEMENTS.length} Placements</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>{OPENINGS.length} Openings</span>
          </div>
        </div>
      </div>

      {/* Stats Panel */}
      {selectedCluster && !zoomedCity && (
        <StatsPanel
          cluster={selectedCluster}
          onClose={handleClose}
          onZoomIn={handleZoomIn}
        />
      )}

      {/* Job Panel */}
      {zoomedCity && selectedCluster && (
        <JobPanel
          items={zoomedItems}
          city={selectedCluster.city}
          state={selectedCluster.state}
          onClose={handleClose}
          onZoomOut={handleZoomOut}
        />
      )}

      <LeafletMap
        clusters={clusters}
        zoomedCity={zoomedCity}
        zoomedItems={zoomedItems}
        mapCenter={mapCenter}
        mapZoom={mapZoom}
        onClusterClick={handleClusterClick}
      />
    </div>
  );
}
