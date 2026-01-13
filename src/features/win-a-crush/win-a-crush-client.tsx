"use client";

import type { PartnerProfile } from "@/features/profile/partner/types";
import {
  WinACrushHeader,
  PracticeCard,
  WhatMattersSection,
  AlternativeActionsSection,
} from "./components";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/commons/page-header";

type WinACrushClientProps = Readonly<{
  partnerProfile: PartnerProfile;
}>;

export function WinACrushClient({ partnerProfile }: WinACrushClientProps) {
  const router = useRouter();
  return (
    <>
      <PageHeader title="" onBackClick={() => router.back()} />
      <main className="flex-1 flex flex-col">
        <WinACrushHeader partnerProfile={partnerProfile} />
        <PracticeCard partnerId={partnerProfile.id} />
        <WhatMattersSection />
        <AlternativeActionsSection />
      </main>
    </>
  );
}
