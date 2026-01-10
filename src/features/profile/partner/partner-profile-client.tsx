"use client";

import { lazy, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PartnerProfileHeader } from "./components";
import ProfileTab from "@/features/profile/common/tabs/profile-tab";
import { MOCK_PARTNER_PROFILE } from "./const";
import { usePartnerProfileForm } from "../hooks/use-partner-profile-form";
import type { PartnerProfile } from "./types";

// Lazy load tab components
const PartnerProfileOverview = lazy(
  () => import("./overview-tab/partner-profile-overview")
);
const SpecialThingsTab = lazy(
  () => import("./special-things-tab/special-things-tab")
);

// Lazy load insights history component (placeholder for now)
const InsightsHistoryTab = lazy(() =>
  Promise.resolve({
    default: () => (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Insights History coming soon...</p>
      </div>
    ),
  })
);

type PartnerProfileClientProps = Readonly<{
  profile?: PartnerProfile;
}>;

// Mock function to determine if user is first-time or returning
// In production, this would check localStorage or API
const isFirstTimeUser = (): boolean => {
  // Mock logic: check localStorage for a flag
  if (globalThis.window === undefined) return true;
  const hasViewedProfile = localStorage.getItem("hasViewedPartnerProfile");
  return !hasViewedProfile;
};

export function PartnerProfileClient({
  profile: initialProfile = MOCK_PARTNER_PROFILE,
}: PartnerProfileClientProps) {
  const router = useRouter();

  // // Use custom hook for form state management
  const {
    draftProfile,
    isSaving,
    hasUnsavedChanges,
    updateHandlers,
    handleSave,
  } = usePartnerProfileForm(initialProfile);

  // Determine default tab: first-time users → "overview", returning → "special-things"
  const getDefaultTab = (): string => {
    if (globalThis.window === undefined) return "overview";
    const savedTab = localStorage.getItem("partnerProfileLastTab");
    if (savedTab) return savedTab;
    return isFirstTimeUser() ? "overview" : "special-things";
  };

  const [activeTab, setActiveTab] = useState<string>(getDefaultTab);

  // Handle tab change and persist preference
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    if (globalThis.window !== undefined) {
      localStorage.setItem("partnerProfileLastTab", tab);
      localStorage.setItem("hasViewedPartnerProfile", "true");
    }
  }, []);

  // Use draftProfile or fallback to initialProfile
  const displayProfile = draftProfile ?? initialProfile;

  const tabs = useMemo(
    () => [
      {
        label: "Overview",
        value: "overview",
        content: (
          <PartnerProfileOverview
            profile={displayProfile}
            onGoalsChange={updateHandlers.onGoalsChange}
            onLoveLanguageChange={updateHandlers.onLoveLanguageChange}
            onCommunicationStylesChange={
              updateHandlers.onCommunicationStylesChange
            }
            onAttachmentTendencyChange={
              updateHandlers.onAttachmentTendencyChange
            }
            onDealBreakersChange={updateHandlers.onDealBreakersChange}
            onAppreciatedThingsChange={updateHandlers.onAppreciatedThingsChange}
            onWorkRhythmChange={updateHandlers.onWorkRhythmChange}
            onSocialEnergyChange={updateHandlers.onSocialEnergyChange}
            onDateBudgetChange={updateHandlers.onDateBudgetChange}
            onHobbiesChange={updateHandlers.onHobbiesChange}
            onFavoriteHobbiesChange={updateHandlers.onFavoriteHobbiesChange}
            onSocialSignalsChange={updateHandlers.onSocialSignalsChange}
          />
        ),
      },
      {
        label: "Insights History",
        value: "insights-history",
        content: <InsightsHistoryTab />,
      },
      {
        label: "Special Things",
        value: "special-things",
        content: (
          <SpecialThingsTab
            profile={displayProfile}
            onSpecialDaysChange={updateHandlers.onSpecialDaysChange}
          />
        ),
      },
    ],
    [displayProfile, updateHandlers]
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="container mx-auto max-w-2xl px-4 py-4">
          <PartnerProfileHeader profile={displayProfile} />
        </div>
      </div>

      {/* Tabs & Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-2xl px-4">
          <div className="sticky top-0 z-10 border-b bg-background">
            <ProfileTab
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="sticky bottom-0 border-t bg-background z-[99]">
        <div className="container mx-auto max-w-2xl px-4 py-4">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
              disabled={isSaving}
            >
              Back
            </Button>
            <Button
              className="flex-1"
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isSaving}
            >
              <Pencil className="size-4 mr-2" />
              {isSaving ? "Saving..." : "Edit Profile"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
