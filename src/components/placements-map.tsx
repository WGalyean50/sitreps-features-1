"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, X, ZoomIn, ZoomOut } from "lucide-react";
import {
  ALL_DATA,
  PLACEMENTS,
  OPENINGS,
  INDUSTRY_INFO,
  getRegionStats,
  type Placement,
} from "@/data/placements";
import { LeafletMap } from "./leaflet-map";

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

export function PlacementsMap() {
  const [selectedCluster, setSelectedCluster] = React.useState<RegionCluster | null>(null);
  const [zoomedCity, setZoomedCity] = React.useState<string | null>(null);
  const [mapCenter, setMapCenter] = React.useState<[number, number]>([39.8283, -98.5795]);
  const [mapZoom, setMapZoom] = React.useState(4);
  const [showPlacements, setShowPlacements] = React.useState(true);
  const [showOpenings, setShowOpenings] = React.useState(true);

  // Filter data based on toggle state
  const filteredData = React.useMemo(() => {
    return ALL_DATA.filter((item) => {
      if (item.type === "placement" && !showPlacements) return false;
      if (item.type === "opening" && !showOpenings) return false;
      return true;
    });
  }, [showPlacements, showOpenings]);

  const clusters = React.useMemo(() => clusterByRegion(filteredData), [filteredData]);

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

  // Get items for zoomed city (already filtered via clusters)
  const zoomedItems = React.useMemo(() => {
    if (!zoomedCity) return [];
    const cluster = clusters.find((c) => `${c.city}-${c.state}` === zoomedCity);
    return cluster?.items || [];
  }, [zoomedCity, clusters]);

  // Build markers based on zoom level
  const markers = React.useMemo(() => {
    if (zoomedCity) {
      // Show individual jobs
      return zoomedItems.map((item) => ({
        id: item.id,
        lat: item.lat,
        lng: item.lng,
        popup: (
          <div>
            <p className="font-medium">{item.title}</p>
            <p className="text-sm">{item.company}</p>
            <p className="text-sm text-muted-foreground">
              ${item.salary.toLocaleString()}
            </p>
          </div>
        ),
      }));
    } else {
      // Show city clusters
      return clusters.map((cluster) => {
        const placements = cluster.items.filter((i) => i.type === "placement").length;
        const openings = cluster.items.filter((i) => i.type === "opening").length;
        return {
          id: cluster.id,
          lat: cluster.lat,
          lng: cluster.lng,
          onClick: () => handleClusterClick(cluster),
          popup: (
            <div className="text-center">
              <p className="font-medium">
                {cluster.city}, {cluster.state}
              </p>
              <p className="text-sm text-muted-foreground">
                {placements} placements, {openings} openings
              </p>
              <p className="text-xs mt-1">Click marker for details</p>
            </div>
          ),
        };
      });
    }
  }, [clusters, zoomedCity, zoomedItems]);

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden border">
      {/* Filter Toggles */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-background/95 backdrop-blur p-3 rounded-lg shadow-lg">
        <p className="text-xs font-medium mb-2">Filter</p>
        <div className="flex gap-3 text-xs">
          <button
            onClick={() => setShowPlacements(!showPlacements)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
              showPlacements
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-muted text-muted-foreground border border-transparent"
            }`}
          >
            <div className={`w-2.5 h-2.5 rounded-full ${showPlacements ? "bg-green-500" : "bg-muted-foreground/40"}`} />
            <span>{PLACEMENTS.length} Placements</span>
          </button>
          <button
            onClick={() => setShowOpenings(!showOpenings)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
              showOpenings
                ? "bg-blue-100 text-blue-700 border border-blue-300"
                : "bg-muted text-muted-foreground border border-transparent"
            }`}
          >
            <div className={`w-2.5 h-2.5 rounded-full ${showOpenings ? "bg-blue-500" : "bg-muted-foreground/40"}`} />
            <span>{OPENINGS.length} Openings</span>
          </button>
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
        center={mapCenter}
        zoom={mapZoom}
        markers={markers}
        height="600px"
      />
    </div>
  );
}
