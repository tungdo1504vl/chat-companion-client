"use client";

import { Sun, Moon, Sunrise, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/commons/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { useProfileAnalysisStore } from "@/stores/profile-analysis.store";
import { extractBigThree } from "@/features/profile/user/utils/natal-chart";
import { zodiacSymbols, zodiacColors } from "@/features/profile/user/const";
import type { TNatalChart, TInsights } from "@/features/profile/user/types";

interface BigThreeCardProps {
  readonly title: string;
  readonly sign: string;
  readonly icon: React.ReactNode;
  readonly description: string;
}

function BigThreeCard({ title, sign, icon, description }: BigThreeCardProps) {
  const symbolColor = zodiacColors[sign] || "bg-gray-500";
  const symbol = zodiacSymbols[sign] || "";

  return (
    <Card className="flex flex-col items-center p-3 md:p-4">
      <div className="mb-2">{icon}</div>
      <div className="text-xs font-semibold text-muted-foreground mb-1">
        {title}
      </div>
      <div className="text-xl md:text-2xl font-bold mb-2">{sign}</div>
      <div className="text-xs text-muted-foreground mb-3 text-center">
        {description}
      </div>
      <div
        className={`w-12 h-12 rounded-full ${symbolColor} flex items-center justify-center text-white text-xl md:text-2xl`}
      >
        {symbol}
      </div>
    </Card>
  );
}

// Zodiac reference data with all 12 signs and their descriptors
const ZODIAC_REFERENCE_DATA = [
  {
    sign: "Aries",
    sun: "Bold & Energetic",
    moon: "Passionate & Reactive",
    rising: "Confident & Direct",
  },
  {
    sign: "Taurus",
    sun: "Stable & Grounded",
    moon: "Comfort-Seeking & Loyal",
    rising: "Calm & Trustworthy",
  },
  {
    sign: "Gemini",
    sun: "Curious & Communicative",
    moon: "Mentally Active & Restless",
    rising: "Witty & Approachable",
  },
  {
    sign: "Cancer",
    sun: "Caring & Protective",
    moon: "Sensitive & Nurturing",
    rising: "Gentle & Emotionally Aware",
  },
  {
    sign: "Leo",
    sun: "Creative & Confident",
    moon: "Warm-Hearted & Expressive",
    rising: "Charismatic & Radiant",
  },
  {
    sign: "Virgo",
    sun: "Practical & Analytical",
    moon: "Thoughtful & Self-Critical",
    rising: "Polite & Detail-Oriented",
  },
  {
    sign: "Libra",
    sun: "Charming & Balanced",
    moon: "Harmony-Seeking & Romantic",
    rising: "Elegant & Likeable",
  },
  {
    sign: "Scorpio",
    sun: "Intense & Powerful",
    moon: "Emotionally Deep & Private",
    rising: "Mysterious & Magnetic",
  },
  {
    sign: "Sagittarius",
    sun: "Optimistic & Adventurous",
    moon: "Freedom-Loving & Honest",
    rising: "Open-Minded & Enthusiastic",
  },
  {
    sign: "Capricorn",
    sun: "Disciplined & Ambitious",
    moon: "Reserved & Responsible",
    rising: "Serious & Reliable",
  },
  {
    sign: "Aquarius",
    sun: "Independent & Visionary",
    moon: "Detached & Idealistic",
    rising: "Unique & Forward-Thinking",
  },
  {
    sign: "Pisces",
    sun: "Compassionate & Imaginative",
    moon: "Intuitive & Emotionally Deep",
    rising: "Dreamy & Gentle",
  },
] as const;

// Helper function to get descriptor from zodiac reference data
function getZodiacDescriptor(planet: string, sign: string): string {
  const zodiacData = ZODIAC_REFERENCE_DATA.find((z) => z.sign === sign);
  if (!zodiacData) return "";

  switch (planet) {
    case "Sun":
      return zodiacData.sun;
    case "Moon":
      return zodiacData.moon;
    case "Ascendant":
      return zodiacData.rising;
    default:
      return "";
  }
}

function getBigThreeIcon(planet: string): {
  icon: React.ReactNode;
} {
  switch (planet) {
    case "Sun":
      return {
        icon: <Sun className="h-6 w-6 text-yellow-500" />,
      };
    case "Moon":
      return {
        icon: <Moon className="h-6 w-6 text-blue-500" />,
      };
    case "Ascendant":
      return {
        icon: <Sunrise className="h-6 w-6 text-orange-500" />,
      };
    default:
      return {
        icon: <Sun className="h-6 w-6 text-gray-500" />,
      };
  }
}

// Helper function to convert store NatalChart to profile TNatalChart
function convertNatalChart(natalChart: any): TNatalChart | null {
  if (!natalChart) return null;

  // The types are compatible, just need to ensure structure matches
  return natalChart as TNatalChart;
}

// Helper function to convert store insights to profile TInsights
function convertInsights(insights: any): TInsights | null {
  if (!insights) return null;

  return {
    analysis_text: insights.analysis_text || "",
  };
}

// Helper function to parse and format insights text with bold astrological terms
function formatInsightsText(text: string): React.ReactNode[] {
  // Common astrological terms to bold
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

  // Split by paragraphs
  const paragraphs = text.split("\n").filter((p) => p.trim().length > 0);

  return paragraphs.map((paragraph, idx) => {
    let formattedText: React.ReactNode[] = [];
    let lastIndex = 0;
    let key = 0;

    // Find and bold astrological terms
    astroTerms.forEach((term) => {
      const regex = new RegExp(String.raw`\b${term}\b`, "gi");
      let match;
      while ((match = regex.exec(paragraph)) !== null) {
        // Add text before match
        if (match.index > lastIndex) {
          formattedText.push(paragraph.substring(lastIndex, match.index));
        }
        // Add bolded term
        formattedText.push(
          <strong key={`${term}-${key++}`}>{match[0]}</strong>
        );
        lastIndex = match.index + match[0].length;
      }
    });

    // Add remaining text
    if (lastIndex < paragraph.length) {
      formattedText.push(paragraph.substring(lastIndex));
    }

    // If no terms were found, return original paragraph
    if (formattedText.length === 0) {
      formattedText = [paragraph];
    }

    return (
      <p
        key={`paragraph-${paragraph.substring(0, 20)}-${idx}`}
        className="text-sm text-foreground leading-relaxed [&_strong]:font-semibold"
      >
        {formattedText}
      </p>
    );
  });
}

interface AstrologyChartScreenProps {
  readonly onNext: () => void;
}

export default function AstrologyChartScreen({
  onNext,
}: AstrologyChartScreenProps) {
  const profileAnalysis = useProfileAnalysisStore(
    (state) => state.profileAnalysis
  );

  const natalChart = convertNatalChart(profileAnalysis?.natal_chart ?? null);
  const insights = convertInsights(profileAnalysis?.insights ?? null);

  const bigThreeData = extractBigThree(natalChart);

  // Transform Big Three data for display with mapped descriptors
  const bigThree = bigThreeData
    ? bigThreeData.map((item) => {
        const { icon } = getBigThreeIcon(item.planet);
        const description = getZodiacDescriptor(item.planet, item.sign);
        return {
          title: item.title,
          sign: item.sign,
          icon,
          description,
        };
      })
    : null;

  // Parse insights text
  const insightsText = insights?.analysis_text || "";
  const formattedInsights = formatInsightsText(insightsText);

  return (
    <div className="flex flex-col h-full bg-background">
      <PageHeader title="My Astrology Chart" />
      {/* Decorative gradient progress bar */}
      <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-2xl px-4 py-6 pb-6 space-y-6">
          {/* Your Cosmic Blueprint Section */}
          <div className="flex flex-col items-center space-y-4">
            {/* Central Graphic */}
            <div className="w-24 h-24 md:w-32 md:h-32 bg-black rounded-lg flex items-center justify-center mb-4">
              <div className="w-20 h-20 md:w-24 md:h-24 border-2 border-blue-400 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-400/20 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-400 rounded-full"></div>
                </div>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-center">
              Your Cosmic Blueprint
            </h1>
            <p className="text-sm text-muted-foreground text-center">
              Analysis complete based on your birth details
            </p>
          </div>

          {/* Big Three Cards */}
          {bigThree?.length === 3 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {bigThree.map((item) => (
                <BigThreeCard
                  key={item.title}
                  title={item.title}
                  sign={item.sign}
                  icon={item.icon}
                  description={item.description}
                />
              ))}
            </div>
          ) : (
            <Card className="p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Chart data is being processed...
              </p>
            </Card>
          )}

          {/* AI Personality Overview Section */}
          {formattedInsights.length > 0 && (
            <Card>
              <CardContent className="p-4 md:p-6 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-base md:text-lg font-semibold">
                    AI Personality Overview
                  </h2>
                </div>
                <div className="space-y-3">{formattedInsights}</div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Next Button */}
      <div className="border-t bg-background px-4 py-4">
        <div className="container mx-auto max-w-2xl">
          <Button
            onClick={onNext}
            className="w-full min-h-[44px] bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
