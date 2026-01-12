"use client";

import { lazy, useState, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/commons/page-header";
import { ProfileInfo } from "@/features/profile/common/header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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

  // Get initials for avatar fallback
  const initials = displayProfile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <PageHeader title="Partner Profile" onBackClick={() => router.back()} />
        {/* Profile Info */}
        <ProfileInfo
          name={displayProfile.name}
          avatarUrl={displayProfile.avatarUrl}
          initials={initials}
          age={displayProfile.age}
          location={displayProfile.location}
          stage={displayProfile.stage}
          isPremium={displayProfile.isPremium}
        />
        <div className="px-4 pb-6">
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-3 bg-muted">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="insights-history"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Insights
              </TabsTrigger>
              <TabsTrigger
                value="special-things"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Special Things
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6 overflow-y-auto">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center py-12">
                    <p className="text-muted-foreground">Loading...</p>
                  </div>
                }
              >
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
                  onAppreciatedThingsChange={
                    updateHandlers.onAppreciatedThingsChange
                  }
                  onWorkRhythmChange={updateHandlers.onWorkRhythmChange}
                  onSocialEnergyChange={updateHandlers.onSocialEnergyChange}
                  onDateBudgetChange={updateHandlers.onDateBudgetChange}
                  onHobbiesChange={updateHandlers.onHobbiesChange}
                  onFavoriteHobbiesChange={
                    updateHandlers.onFavoriteHobbiesChange
                  }
                  onInstagramUrlChange={updateHandlers.onInstagramUrlChange}
                />
              </Suspense>
            </TabsContent>

            {/* Insights History Tab */}
            <TabsContent value="insights-history" className="mt-6">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center py-12">
                    <p className="text-muted-foreground">Loading...</p>
                  </div>
                }
              >
                <InsightsHistoryTab />
              </Suspense>
            </TabsContent>

            {/* Special Things Tab */}
            <TabsContent value="special-things" className="mt-6">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center py-12">
                    <p className="text-muted-foreground">Loading...</p>
                  </div>
                }
              >
                <SpecialThingsTab
                  profile={displayProfile}
                  onSpecialDaysChange={updateHandlers.onSpecialDaysChange}
                />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="sticky bottom-16 border-t bg-background z-40">
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
