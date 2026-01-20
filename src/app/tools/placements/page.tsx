"use client";

import * as React from "react";
import { ToolLayout } from "@/components/layout";
import { PlacementsMap } from "@/components/placements-map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PLACEMENTS, OPENINGS, INDUSTRY_INFO, getRegionStats } from "@/data/placements";
import { Users, Briefcase, TrendingUp, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";

export default function PlacementsPage() {
  const allData = [...PLACEMENTS, ...OPENINGS];
  const stats = getRegionStats(allData);

  const avgSalary = Math.round(
    allData.reduce((sum, item) => sum + item.salary, 0) / allData.length
  );

  return (
    <ToolLayout
      title="Veteran Placements Heatmap"
      description="Explore where veterans are getting placed and current job openings across the US."
    >
      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{PLACEMENTS.length}</p>
                <p className="text-sm text-muted-foreground">Total Placements</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{OPENINGS.length}</p>
                <p className="text-sm text-muted-foreground">Active Openings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-100">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${Math.round(avgSalary / 1000)}k</p>
                <p className="text-sm text-muted-foreground">Avg Salary</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-orange-100">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{new Set(allData.map(d => d.city)).size}</p>
                <p className="text-sm text-muted-foreground">Metro Areas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Interactive Placements Map
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Click on a city marker to see industry breakdown and average salaries.
            Then click &ldquo;View Individual Jobs&rdquo; to see specific positions.
          </p>
        </CardHeader>
        <CardContent>
          <PlacementsMap />
        </CardContent>
      </Card>

      {/* Industry Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Industry Breakdown</CardTitle>
          <p className="text-sm text-muted-foreground">
            Distribution of placements and openings by industry
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.industry}
                className="p-4 rounded-lg border"
                style={{ borderLeftColor: stat.color, borderLeftWidth: 4 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{stat.name}</span>
                  <span
                    className="px-2 py-0.5 rounded text-sm"
                    style={{
                      backgroundColor: `${stat.color}20`,
                      color: stat.color,
                    }}
                  >
                    {stat.percent}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{stat.count} positions</span>
                  <span className="font-medium text-foreground">
                    ${stat.avgSalary.toLocaleString()} avg
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
