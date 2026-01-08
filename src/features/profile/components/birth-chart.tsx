"use client";

import {
  Check,
  Globe,
  MessageCircle,
  Sparkles,
  Sun,
  Moon,
  Sunrise,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TNatalChart, TInsights } from "../types";
import { zodiacSymbols, planetSymbols, zodiacColors } from "../const";
import {
  extractBigThree,
  extractPlanetaryPositions,
} from "../utils/natal-chart";

export interface BirthChartProps {
  readonly natalChart?: TNatalChart | null;
  readonly insights?: TInsights | null;
}

interface BigThreeCardProps {
  readonly title: string;
  readonly sign: string;
  readonly icon: React.ReactNode;
  readonly iconColor: string;
}

function BigThreeCard({ title, sign, icon, iconColor }: BigThreeCardProps) {
  const symbolColor = zodiacColors[sign] || "bg-gray-500";
  const symbol = zodiacSymbols[sign] || "";

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className={`${iconColor} mb-2`}>{icon}</div>
      <div className="text-xs font-semibold text-gray-500 mb-1">{title}</div>
      <div className="text-2xl font-bold mb-2">{sign}</div>
      <div
        className={`w-12 h-12 rounded-full ${symbolColor} flex items-center justify-center text-white text-2xl`}
      >
        {symbol}
      </div>
    </div>
  );
}

function getBigThreeIcon(planet: string): {
  icon: React.ReactNode;
  iconColor: string;
} {
  switch (planet) {
    case "Sun":
      return {
        icon: <Sun className="h-5 w-5 text-orange-500" />,
        iconColor: "text-orange-500",
      };
    case "Moon":
      return {
        icon: <Moon className="h-5 w-5 text-gray-500" />,
        iconColor: "text-gray-500",
      };
    case "Ascendant":
      return {
        icon: <Sunrise className="h-5 w-5 text-gray-500" />,
        iconColor: "text-gray-500",
      };
    default:
      return {
        icon: <Sun className="h-5 w-5 text-gray-500" />,
        iconColor: "text-gray-500",
      };
  }
}

function BirthChart({ natalChart, insights }: BirthChartProps) {
  const bigThreeData = extractBigThree(natalChart);
  const planetaryPositions = extractPlanetaryPositions(natalChart);

  // Transform Big Three data for display
  const bigThree = bigThreeData
    ? bigThreeData.map((item) => {
        const { icon, iconColor } = getBigThreeIcon(item.planet);
        return {
          title: item.title,
          sign: item.sign,
          icon,
          iconColor,
        };
      })
    : null;

  // Parse insights text into paragraphs
  const insightsText = insights?.analysis_text || "";
  const insightsParagraphs = insightsText
    .split("\n")
    .filter((p) => p.trim().length > 0);

  const hasData = !!natalChart;
  const hasBigThree = !!bigThree;
  const hasPlanetaryPositions = planetaryPositions.length > 0;
  const hasInsights = insightsParagraphs.length > 0;

  return (
    <div className="w-full space-y-6">
      {/* Relationship Seeker Badge */}
      <div className="flex justify-center">
        <Badge
          variant="outline"
          className="bg-pink-100 text-pink-700 border-pink-200 px-3 py-1 rounded-full"
        >
          Relationship Seeker
        </Badge>
      </div>

      {/* AI Chart Analysis Banner */}
      <div className="bg-red-500 rounded-lg p-4 flex items-center justify-between text-white">
        <div className="flex-1">
          <p className="font-medium text-sm">
            Discover compatibility insights based on your planetary positions.
          </p>
        </div>
        <div className="ml-4 bg-white/20 rounded-full p-2">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
      </div>

      {/* The Big Three Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-red-500" />
          <h3 className="text-lg font-semibold">The Big Three</h3>
        </div>
        {hasBigThree ? (
          <div className="grid grid-cols-3 gap-3">
            {bigThree.map((item) => (
              <BigThreeCard
                key={item.title}
                title={item.title}
                sign={item.sign}
                icon={item.icon}
                iconColor={item.iconColor}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center text-sm text-gray-500">
            {hasData
              ? "Big Three data is incomplete"
              : "Birth chart data not available"}
          </div>
        )}
      </div>

      {/* Planetary Positions Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-red-500" />
          <h3 className="text-lg font-semibold">Planetary Positions</h3>
        </div>
        {hasPlanetaryPositions ? (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      PLANET
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      SIGN
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      DEGREE
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {planetaryPositions.map((position) => {
                    const symbolColor =
                      zodiacColors[position.sign] || "bg-gray-500";
                    const planetSymbol = planetSymbols[position.planet] || "";
                    const zodiacSymbol = zodiacSymbols[position.sign] || "";
                    return (
                      <tr key={position.planet} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{planetSymbol}</span>
                            <span className="font-medium">
                              {position.planet}
                              {position.retrograde && (
                                <span className="ml-1 text-xs text-gray-400">
                                  (R)
                                </span>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <span>{position.sign}</span>
                            <span
                              className={`w-6 h-6 rounded-full ${symbolColor} flex items-center justify-center text-white text-xs`}
                            >
                              {zodiacSymbol}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          {position.degree}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center text-sm text-gray-500">
            {hasData
              ? "Planetary positions data not available"
              : "Birth chart data not available"}
          </div>
        )}
      </div>

      {/* Chart Insights Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-red-500" />
          <h3 className="text-lg font-semibold">Chart Insights</h3>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
          {hasInsights ? (
            insightsParagraphs.map((paragraph) => (
              <p
                key={paragraph.substring(0, 50)}
                className="text-sm text-gray-700 leading-relaxed"
              >
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">
              Insights not available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default BirthChart;
