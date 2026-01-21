"use client";

import { useEffect } from "react";
import { Sun, Moon, ArrowUpRight, Sparkles, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { PrimaryActionButton } from "@/components/commons/primary-action-button";
import { Card, CardContent } from "@/components/ui/card";
import { useUserStoreState } from "@/stores/user/provider";
import { extractBigThree } from "@/features/profile/user/utils/natal-chart";
import type { TNatalChart, TInsights } from "@/features/profile/user/types";
import Image from "next/image";

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
    birth_chart_analysis_text: insights.birth_chart_analysis_text || "",
  };
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

interface AstrologyChartScreenProps {
  readonly onNext: () => void;
}

export default function AstrologyChartScreen({
  onNext,
}: AstrologyChartScreenProps) {
  const userInfo = useUserStoreState((state) => state.userInfo);
  const isLoading = useUserStoreState((state) => state.isLoading);
  const loadUserInfo = useUserStoreState((state) => state.loadUserInfo);

  // Load user info on mount if not already loaded
  useEffect(() => {
    if (!userInfo && !isLoading) {
      loadUserInfo();
    }
  }, [userInfo, isLoading, loadUserInfo]);

  const natalChart = convertNatalChart(userInfo?.natal_chart ?? null);
  const insights = convertInsights(userInfo?.insights ?? null);

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
                  src={userInfo?.profile?.basic_info?.avatar_url || ""}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover opacity-80 mix-blend-screen"
                />
              </div>
            </div>
            <h2 className="font-bold text-2xl text-center text-[#1A1A1A] dark:text-[#F0F0F0] mb-2 leading-tight">
              Your Cosmic Blueprint
            </h2>
            <p className="text-[#555555] dark:text-[#A0A0A0] text-center text-sm px-4">
              Analysis complete based on your birth details
            </p>
          </div>

          {/* AI Personality Overview Section */}
          {insightsText && (
            <Card className="bg-[#FFFFFF] dark:bg-[#2D2628] rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(242,107,122,0.15)] border border-gray-50 dark:border-gray-800 relative mb-8 transition-all duration-200">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-[#F26B7A] flex items-center justify-center text-white shadow-[0_0_20px_rgba(242,107,122,0.3)] transition-transform duration-200 hover:scale-105">
                    <Sparkles size={16} className="text-sm" />
                  </div>
                  <h3 className="font-semibold text-lg text-[#1A1A1A] dark:text-[#F0F0F0]">
                    Your portrait in a relationship
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


        </div>

        {/* Fixed Bottom Button */}
        <div className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto p-6 bg-gradient-to-t from-[#FFF9F5] dark:from-[#1F1A1C] via-[#FFF9F5] dark:via-[#1F1A1C] to-transparent z-50">
          <PrimaryActionButton
            onClick={onNext}
            label="Build your relationship"
            icon={<ArrowRight />}
            className="size-full flex-row-reverse"
            iconClassName="text-lg"
          />
        </div>
      </div>
    </div>
  );
}
