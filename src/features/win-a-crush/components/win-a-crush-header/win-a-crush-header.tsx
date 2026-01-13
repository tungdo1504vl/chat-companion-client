"use client";

import type { PartnerProfile } from "@/features/profile/partner/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type WinACrushHeaderProps = Readonly<{
  partnerProfile: PartnerProfile;
}>;

export function WinACrushHeader({ partnerProfile }: WinACrushHeaderProps) {
  const initials = partnerProfile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="px-8 pt-2 pb-6 flex flex-col items-center text-center h-[25vh] min-h-[180px] justify-center">
      <div className="mb-3">
        <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-romantic-400/80">
          The Journey
        </span>
      </div>
      <div className="relative mb-3">
        <Avatar className="w-16 h-16 rounded-full border-2 border-white shadow-md">
          {partnerProfile.avatarUrl ? (
            <AvatarImage
              src={partnerProfile.avatarUrl}
              alt={partnerProfile.name}
              className="object-cover"
            />
          ) : null}
          <AvatarFallback className="bg-romantic-100 text-romantic-500 text-sm font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
      <h1 className="font-serif text-xl text-slate-900 leading-tight">
        There's something you've been wanting to say to {partnerProfile.name}…
      </h1>
      <p className="text-romantic-400/90 text-xs mt-1 italic font-medium">
        And you want to say it right.
      </p>
    </header>
  );
}
