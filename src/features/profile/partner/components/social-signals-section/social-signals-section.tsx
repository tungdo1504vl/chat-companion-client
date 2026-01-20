"use client";

import { Network, Palette, Heart } from "lucide-react";
import { cn } from "@/libs/tailwind/utils";
import type { PartnerProfile } from "../../types";

interface SocialSignalsSectionProps {
  profile: PartnerProfile;
  instagramUrl?: string;
  savedInstagramUrl?: string; // Instagram URL from API (saved profile)
  onInstagramUrlChange?: (url: string) => void;
  className?: string;
}


const getSignalIcon = (iconName?: string) => {
  if (!iconName) return Palette;
  // Map icon names to Lucide icons
  const iconMap: Record<string, React.ComponentType<any>> = {
    palette: Palette,
    pets: Heart,
    paw: Heart,
  };
  return iconMap[iconName.toLowerCase()] || Palette;
};

export function SocialSignalsSection({
  profile,
  instagramUrl = "",
  savedInstagramUrl,
  onInstagramUrlChange,
  className,
}: SocialSignalsSectionProps) {
  // const hasInstagram = profile.instagramUrl || instagramUrl || savedInstagramUrl;
  // const hasTiktok = profile.tiktokUrl;

  const hasInstagram = true;
  const hasTiktok = false;

  return (
    <section className={cn("bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800", className)}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Network className="text-primary" />
          <h3 className="font-display text-xl font-bold">Social Signals</h3>
        </div>
        {(hasInstagram || hasTiktok) && (
          <div className="flex -space-x-2">
            {hasInstagram && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                <span className="text-[10px] text-white font-bold">IG</span>
              </div>
            )}
            {hasTiktok && (
              <div className="w-8 h-8 rounded-full bg-black border-2 border-white dark:border-slate-900 flex items-center justify-center">
                <span className="text-[10px] text-white font-bold">TT</span>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="space-y-6">
        {profile.socialSignals?.map((signal, index) => {
          const Icon = getSignalIcon(signal.icon);
          return (
            <div key={index} className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                <Icon className="text-slate-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold">{signal.title}</h4>
                <p className="text-xs text-slate-500">{signal.description}</p>
              </div>
            </div>
          );
        })}
        {profile.socialSignalTags && profile.socialSignalTags.length > 0 && (
          <div className="flex gap-2 pt-2">
            {profile.socialSignalTags.map((tag, index) => (
              <span
                key={index}
                className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
