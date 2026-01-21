"use client";

import {
  Globe,
  Sparkles,
  Sun,
  Moon,
  Sunrise,
  CheckCircle2,
  XCircle,
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

// Types for structured insights
interface InsightSection {
  type: "heading" | "bullet" | "needs-header" | "needs-item" | "avoid-header" | "avoid-item" | "paragraph";
  content: string;
  icon?: "check" | "x";
}

// Helper function to parse structured insights text
function parseInsightsText(text: string): InsightSection[] {
  const lines = text.split("\n").filter((line) => line.trim().length > 0);
  const sections: InsightSection[] = [];

  let i = 0;
  let currentContext: "needs" | "avoid" | null = null;

  while (i < lines.length) {
    const line = lines[i].trim();

    // Check for headings
    if (
      line.startsWith("When the relationship is stable") ||
      line.startsWith("When problems begin to appear") ||
      line.match(/^\d+\.\s*What.*NEEDS/i)
    ) {
      // Clean up numbered prefix if present
      const cleanContent = line.replace(/^\d+\.\s*/, "");
      sections.push({ type: "heading", content: cleanContent });
      currentContext = null; // Reset context after heading
      i++;
      continue;
    }

    // Check for needs header with checkmark (can be on same line or separate)
    if (
      line.includes(":white_check_mark:") ||
      line.includes("✅") ||
      (line.includes("A partner who:") && (i > 0 && lines[i - 1]?.includes("NEEDS")))
    ) {
      const cleanContent = line
        .replace(/:white_check_mark:/g, "")
        .replace(/✅/g, "")
        .trim();
      sections.push({ type: "needs-header", content: cleanContent, icon: "check" });
      currentContext = "needs";
      i++;
      continue;
    }

    // Check for avoid header with X
    if (
      line.includes(":x:") ||
      line.includes("❌") ||
      line.startsWith("Avoid:")
    ) {
      const cleanContent = line
        .replace(/:x:/g, "")
        .replace(/❌/g, "")
        .trim();
      sections.push({ type: "avoid-header", content: cleanContent, icon: "x" });
      currentContext = "avoid";
      i++;
      continue;
    }

    // Check for bullet points
    if (line.startsWith("•") || line.startsWith("-") || line.match(/^\s*[•-]\s/)) {
      // Remove bullet and clean up arrow emojis
      const cleanContent = line
        .replace(/^[•-]\s*/, "")
        .replace(/→/g, "→")
        .trim();

      // Use context to determine type
      if (currentContext === "needs") {
        sections.push({ type: "needs-item", content: cleanContent });
      } else if (currentContext === "avoid") {
        sections.push({ type: "avoid-item", content: cleanContent });
      } else {
        sections.push({ type: "bullet", content: cleanContent });
      }
      i++;
      continue;
    }

    // Regular paragraph - reset context if we hit non-bullet text
    if (currentContext && !line.match(/^\s*[•-]/)) {
      currentContext = null;
    }
    sections.push({ type: "paragraph", content: line });
    i++;
  }

  return sections;
}

// Helper function to highlight astrological terms
function highlightAstroTerms(text: string): React.ReactNode[] {
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

  let formattedText: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  astroTerms.forEach((term) => {
    const regex = new RegExp(String.raw`\b${term}\b`, "gi");
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        formattedText.push(text.substring(lastIndex, match.index));
      }
      formattedText.push(
        <span key={`${term}-${key++}`} className="text-[#F26B7A] font-medium">
          {match[0]}
        </span>
      );
      lastIndex = match.index + match[0].length;
    }
  });

  if (lastIndex < text.length) {
    formattedText.push(text.substring(lastIndex));
  }

  return formattedText.length > 0 ? formattedText : [text];
}

// Helper function to format structured insights with improved UI
function formatInsightsText(text: string): React.ReactNode {
  const sections = parseInsightsText(text);

  // If no structured content detected, fall back to simple paragraph formatting
  if (sections.length === 0 || sections.every(s => s.type === "paragraph")) {
    const paragraphs = text.split("\n").filter((p) => p.trim().length > 0);
    return (
      <div className="space-y-4">
        {paragraphs.map((paragraph, idx) => (
          <p
            key={`paragraph-${idx}`}
            className="text-sm text-[#555555] dark:text-[#A0A0A0] leading-relaxed"
          >
            {highlightAstroTerms(paragraph)}
          </p>
        ))}
      </div>
    );
  }

  // Group sections by logical blocks for better spacing
  const groupedSections: Array<{ sections: InsightSection[]; type: "block" | "item" }> = [];
  let currentBlock: InsightSection[] = [];

  sections.forEach((section, idx) => {
    if (section.type === "heading" || section.type === "needs-header" || section.type === "avoid-header") {
      if (currentBlock.length > 0) {
        groupedSections.push({ sections: [...currentBlock], type: "block" });
      }
      currentBlock = [section];
    } else {
      currentBlock.push(section);
    }
  });
  if (currentBlock.length > 0) {
    groupedSections.push({ sections: [...currentBlock], type: "block" });
  }

  return (
    <div className="space-y-8">
      {groupedSections.map((group, groupIdx) => (
        <div
          key={`group-${groupIdx}`}
          className="space-y-3"
          style={{
            animation: `fadeIn 0.2s ease-out ${groupIdx * 0.05}s both`,
          }}
        >
          {group.sections.map((section, idx) => {
            const key = `section-${groupIdx}-${idx}-${section.type}`;

            switch (section.type) {
              case "heading":
                return (
                  <div key={key} className="mb-1">
                    <h4 className="text-base font-semibold text-[#1A1A1A] dark:text-[#F0F0F0] leading-snug">
                      {section.content}
                    </h4>
                  </div>
                );

              case "bullet":
                return (
                  <div key={key} className="flex items-start gap-3 pl-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#F26B7A]/40 dark:bg-[#F26B7A]/50 mt-2 shrink-0 transition-opacity duration-150" />
                    <p className="text-sm text-[#555555] dark:text-[#A0A0A0] leading-relaxed flex-1">
                      {highlightAstroTerms(section.content)}
                    </p>
                  </div>
                );

              case "needs-header":
                return (
                  <div key={key} className="mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-md bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center shrink-0 transition-transform duration-150 hover:scale-105">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                      </div>
                      <h4 className="text-base font-semibold text-[#1A1A1A] dark:text-[#F0F0F0] leading-snug">
                        {section.content}
                      </h4>
                    </div>
                  </div>
                );

              case "needs-item":
                return (
                  <div key={key} className="flex items-start gap-3 pl-7">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 dark:bg-emerald-500/70 mt-2 shrink-0 transition-opacity duration-150" />
                    <p className="text-sm text-[#555555] dark:text-[#A0A0A0] leading-relaxed flex-1">
                      {highlightAstroTerms(section.content)}
                    </p>
                  </div>
                );

              case "avoid-header":
                return (
                  <div key={key} className="mb-2 mt-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-md bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center shrink-0 transition-transform duration-150 hover:scale-105">
                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-500" />
                      </div>
                      <h4 className="text-base font-semibold text-[#1A1A1A] dark:text-[#F0F0F0] leading-snug">
                        {section.content}
                      </h4>
                    </div>
                  </div>
                );

              case "avoid-item":
                return (
                  <div key={key} className="flex items-start gap-3 pl-7">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/60 dark:bg-red-500/70 mt-2 shrink-0 transition-opacity duration-150" />
                    <p className="text-sm text-[#555555] dark:text-[#A0A0A0] leading-relaxed flex-1">
                      {highlightAstroTerms(section.content)}
                    </p>
                  </div>
                );

              default:
                return (
                  <p
                    key={key}
                    className="text-sm text-[#555555] dark:text-[#A0A0A0] leading-relaxed"
                  >
                    {highlightAstroTerms(section.content)}
                  </p>
                );
            }
          })}
        </div>
      ))}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
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
      {insightsText && (
        <Card className="bg-[#FFFFFF] dark:bg-[#2D2628] rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(242,107,122,0.15)] border border-gray-50 dark:border-gray-800 relative mb-8 transition-all duration-200">
          <CardContent className="p-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#F26B7A] flex items-center justify-center text-white shadow-[0_0_20px_rgba(242,107,122,0.3)] transition-transform duration-200 hover:scale-105">
                <Sparkles size={16} className="text-sm" />
              </div>
              <h3 className="font-semibold text-lg text-[#1A1A1A] dark:text-[#F0F0F0]">
                AI Personality Overview
              </h3>
            </div>
            <div className="relative">
              {formattedInsights}
            </div>
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
