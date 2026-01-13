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
          Win your crush
        </span>
      </div>
      <div className="relative mb-3">
        <Avatar className="w-16 h-16 rounded-full border-2 border-white shadow-md">
          {partnerProfile.avatarUrl ? (
            <AvatarImage
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFBu7ihKfRsIjq6dEDQDkTqn4LzycaeVwJi-A8kD9EBRvazPeVl5o7enP19JsooIn6KBCFf-gl-JkhWnsJIfsQ1vb7ie0Jz2NOWaM_jCk9v15OTwILMkpv1yMyGNWoQ2mJIxRKZ9pzLAB32lk_5W15IJubeE7TcRxF2w1OrZLPJejDL_6KU3b_74wVpY8yoj2ejsuWIsNNDEYCwSF27MqvL_RjMapch817j9wSP9qmTFL5Sog3s2uXlxVubLske_JWd_TbNqcD8w"
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
        {/* There's something you've been wanting to say to {partnerProfile.name}… */}
        Sarah means the world to you, it's time to let her know
      </h1>
      <p className="text-romantic-400/90 text-xs mt-1 italic font-medium">
        Experience a conversation with her vivid AI persona
      </p>
    </header>
  );
}
