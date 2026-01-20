"use client";

import {
  Globe,
  Sparkles,
  Sun,
  Moon,
  Sunrise,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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

// Helper function to parse and format insights text with primary color for astrological terms
function formatInsightsText(text: string): React.ReactNode[] {
  const astroTerms = [
    "Sun in",
    "Moon in",
    "Rising",
    "Ascendant",
    "Leo",
    "Pisces",
    "Libra",
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Virgo",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
  ];

  const paragraphs = text.split("\n").filter((p) => p.trim().length > 0);

  return paragraphs.map((paragraph, idx) => {
    let formattedText: React.ReactNode[] = [];
    let lastIndex = 0;
    let key = 0;

    astroTerms.forEach((term) => {
      const regex = new RegExp(String.raw`\b${term}\b`, "gi");
      let match;
      while ((match = regex.exec(paragraph)) !== null) {
        if (match.index > lastIndex) {
          formattedText.push(paragraph.substring(lastIndex, match.index));
        }
        formattedText.push(
          <span key={`${term}-${key++}`} className="text-[#F26B7A] font-medium">
            {match[0]}
          </span>
        );
        lastIndex = match.index + match[0].length;
      }
    });

    if (lastIndex < paragraph.length) {
      formattedText.push(paragraph.substring(lastIndex));
    }

    if (formattedText.length === 0) {
      formattedText = [paragraph];
    }

    return (
      <p
        key={`paragraph-${paragraph.substring(0, 20)}-${idx}`}
        className="text-sm text-[#555555] dark:text-[#A0A0A0] leading-relaxed mt-4 first:mt-0"
      >
        {formattedText}
      </p>
    );
  });
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

  // Parse insights text
  const insightsText = insights?.analysis_text || "";
  const formattedInsights = formatInsightsText(insightsText);

  const hasData = !!natalChart;
  const hasPlanetaryPositions = planetaryPositions.length > 0;

  return (
    <div className="w-full space-y-6">
      {/* AI Chart Analysis Banner */}

      {/* Chart Insights Section */}
      {formattedInsights.length > 0 && (
        <Card className="bg-[#FFFFFF] dark:bg-[#2D2628] rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(242,107,122,0.15)] border border-gray-50 dark:border-gray-800 relative mb-8">
          <CardContent className="p-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#F26B7A] flex items-center justify-center text-white shadow-[0_0_20px_rgba(242,107,122,0.3)]">
                <Sparkles size={16} className="text-sm" />
              </div>
              <h3 className="font-semibold text-lg text-[#1A1A1A] dark:text-[#F0F0F0]">
                AI Personality Overview
              </h3>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none text-[#555555] dark:text-[#A0A0A0] leading-relaxed">
              {formattedInsights}
            </div>
            {/* Gradient fade at bottom */}
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#FFFFFF] dark:from-[#2D2628] to-transparent rounded-b-3xl pointer-events-none" />
          </CardContent>
        </Card>
      )}
      {/* Big Three Cards */}
      {bigThree?.length === 3 ? (
        <div className="grid grid-cols-3 gap-3 mb-8">
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
        <Card className="p-4 text-center mb-8">
          <p className="text-sm text-[#555555] dark:text-[#A0A0A0]">
            Chart data is being processed...
          </p>
        </Card>
      )}

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
    </div>
  );
}

export default BirthChart;
