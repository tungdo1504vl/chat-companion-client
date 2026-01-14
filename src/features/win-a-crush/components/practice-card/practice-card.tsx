"use client";

import { Heart, HeartIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { buildPartnerChatRoute } from "@/constants/routes";

type PracticeCardProps = {
  partnerId: string;
};

export function PracticeCard({ partnerId }: PracticeCardProps) {
  const router = useRouter();

  const handlePracticeClick = () => {
    // Navigate to chat screen with query param to open modal
    router.push(`${buildPartnerChatRoute(partnerId)}?openModal=true`);
  };

  return (
    <section className="px-6 mb-8">
      <div className="bg-white rounded-[32px] p-8 text-center soft-card-shadow border border-romantic-100/50 relative overflow-hidden">
        {/* Decorative blur circle */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-romantic-50 rounded-full blur-2xl"></div>

        <div className="relative z-10 space-y-2 mb-8">
          <h2 className="text-2xl font-serif text-slate-900">Hear her voice</h2>
          <h2 className="text-2xl font-serif text-slate-900">
            Feel her reaction
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            You've imagined this moment a thousands times. Let's make it real.
          </p>
        </div>

        <button
          onClick={handlePracticeClick}
          className="w-full bg-romantic-500 text-white py-3 px-6 rounded-2xl font-bold text-base shadow-lg shadow-romantic-200 active:scale-[0.98] transition-all flex items-center justify-center gap-3 relative z-10"
        >
          {/* <HeartIcon className="material-symbols-outlined text-xl" /> */}
          Rehearse the moment
        </button>

        <div className="mt-4">
          <p className="text-[11px] text-romantic-300 font-semibold tracking-wide uppercase">
            Your secret space
          </p>
        </div>
      </div>
    </section>
  );
}
