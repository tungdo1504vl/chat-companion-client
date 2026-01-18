"use client";

import { Sun, Moon, ArrowUpRight, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/commons/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { useProfileAnalysisStore } from "@/stores/profile-analysis.store";
import { extractBigThree } from "@/features/profile/user/utils/natal-chart";
import type { TNatalChart, TInsights } from "@/features/profile/user/types";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface BigThreeCardProps {
  readonly title: string;
  readonly sign: string;
  readonly icon: React.ReactNode;
  readonly description: string;
}

function BigThreeCard({ title, sign, icon, description }: BigThreeCardProps) {
  // Determine icon background color based on planet
  let iconBgClass = "bg-yellow-100 dark:bg-yellow-900/30";
  let iconColorClass = "text-yellow-600 dark:text-yellow-400";

  
  if (title.toLowerCase() === "moon") {
    iconBgClass = "bg-indigo-100 dark:bg-indigo-900/30";
    iconColorClass = "text-indigo-500 dark:text-indigo-400";
  } else if (title.toLowerCase() === "rising") {
    iconBgClass = "bg-pink-100 dark:bg-pink-900/30";
    iconColorClass = "text-pink-500 dark:text-pink-400";
  }

  return (
    <Card className="bg-card-light dark:bg-card-dark rounded-2xl p-4 flex flex-col items-center shadow-sm border border-gray-100 dark:border-gray-800">
      <div className={`w-10 h-10 rounded-full ${iconBgClass} flex items-center justify-center mb-3 ${iconColorClass}`}>
        {icon}
      </div>
      <span className="text-[10px] uppercase tracking-wider text-text-sub-light dark:text-text-sub-dark font-semibold mb-1">
        {title}
      </span>
      <span className="font-bold text-lg text-text-main-light dark:text-text-main-dark mb-1">
        {sign}
      </span>
      <span className="text-[10px] text-center text-text-sub-light dark:text-text-sub-dark leading-tight">
        {description}
      </span>
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
        icon: <Sun className="text-xl" />,
      };
    case "Moon":
      return {
        icon: <Moon className="text-xl" />,
      };
    case "Ascendant":
      return {
        icon: <ArrowUpRight className="text-xl" />,
      };
    default:
      return {
        icon: <Sun className="text-xl" />,
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

interface AstrologyChartScreenProps {
  readonly onNext: () => void;
}

export default function AstrologyChartScreen({
  onNext,
}: AstrologyChartScreenProps) {
  const router = useRouter();
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
    <div className="relative min-h-screen bg-[#FFF9F5] dark:bg-[#1F1A1C] font-sans antialiased transition-colors duration-300">
      {/* Decorative background blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[40%] rounded-full bg-[#FDECEF] dark:bg-[#F26B7A]/10 blur-3xl -z-10 opacity-60" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[50%] rounded-full bg-[#FDECEF] dark:bg-[#F26B7A]/10 blur-3xl -z-10 opacity-60" />

      {/* Scrollable content container */}
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col relative max-h-screen overflow-y-auto">
                {/* Header */}

      <PageHeader title="My Astrology Chart" onBackClick={() => router.back()} className="mb-6" />

        {/* Scrollable content area */}
        <div className="flex-1  px-6 py-6 pb-32">

          {/* Your Cosmic Blueprint Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-6">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-[#F26B7A]/20 blur-xl rounded-full transform scale-110" />
              {/* Avatar container */}
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-[#2D2628] shadow-[0_10px_40px_-10px_rgba(242,107,122,0.15)] relative z-10 bg-black flex items-center justify-center">
                <Image
                  alt="Cosmic Avatar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuArXd0uh_b5aeki52B95_7Y0hVu8CMOzFOKd4672EK1kuN8wB7ua6QKNbd6sIOpiFQktPyamPscJM4ivNH4YMkpwNOUfH1iNAIKMJGo69sKN7UihRzGnyCLjQnJG-Naoam5ZEmrE0ejzIX-4WPAwFuK60V8W0AKtwJkIe6qRCoqNVPTXBf5IlC2YnuMFMNESJvJqeWcJJFZcfpQjoLANsoyj9Hc6VzFhyTb7zvq8UsasfRFSpuoqyNs12z78j8f2J2Y-yEts5PhnYFB"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover opacity-80 mix-blend-screen"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles 
                    className="text-6xl text-[#F26B7A] animate-pulse" 
                    style={{ textShadow: "0 0 20px rgba(242,107,122,0.8)" }}
                  />
                </div>
              </div>
            </div>
            <h2 className="font-bold text-2xl text-center text-[#1A1A1A] dark:text-[#F0F0F0] mb-2 leading-tight">
              Your Cosmic Blueprint
            </h2>
            <p className="text-[#555555] dark:text-[#A0A0A0] text-center text-sm px-4">
              Analysis complete based on your birth details
            </p>
          </div>

          {/* Big Three Cards */}
          {bigThree?.length === 3 ? (
            <div className="grid grid-cols-3 gap-3 mb-8">
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
            <Card className="p-4 text-center mb-8">
              <p className="text-sm text-[#555555] dark:text-[#A0A0A0]">
                Chart data is being processed...
              </p>
            </Card>
          )}

          {/* AI Personality Overview Section */}
          {formattedInsights.length > 0 && (
            <Card className="bg-[#FFFFFF] dark:bg-[#2D2628] rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(242,107,122,0.15)] border border-gray-50 dark:border-gray-800 relative mb-8">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#F26B7A] flex items-center justify-center text-white shadow-[0_0_20px_rgba(242,107,122,0.3)]">
                    <Sparkles className="text-sm" />
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
        </div>

        {/* Fixed Bottom Button */}
        <div className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto p-6 bg-gradient-to-t from-[#FFF9F5] dark:from-[#1F1A1C] via-[#FFF9F5] dark:via-[#1F1A1C] to-transparent z-50">
          <Button
            onClick={onNext}
            className="w-full bg-[#F26B7A] hover:bg-[#D65A68] text-white font-medium py-4 rounded-xl shadow-[0_10px_40px_-10px_rgba(242,107,122,0.15)] shadow-[#F26B7A]/30 transform transition active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>Next Step</span>
            <ArrowRight className="text-lg" />
          </Button>
        </div>
      </div>
    </div>
  );
}
