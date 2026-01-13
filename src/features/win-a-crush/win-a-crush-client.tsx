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
      <PageHeader
        title=""
        onBackClick={() => router.back()}
        className="absolute top-4 left-0"
      />
      <main className="flex-1 flex flex-col pb-16 pt-12">
        <WinACrushHeader partnerProfile={partnerProfile} />
        <PracticeCard partnerId={partnerProfile.id} />
        <WhatMattersSection />
        <AlternativeActionsSection />
      </main>
    </>
  );
}
