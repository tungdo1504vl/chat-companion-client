"use client";

import { lazy, useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PartnerProfileHeader } from "./components";
import ProfileTab from "@/features/profiles/common/tabs/profile-tab";
import { MOCK_PARTNER_PROFILE } from "./const";
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

export function PartnerProfileClient({
  profile = MOCK_PARTNER_PROFILE,
}: PartnerProfileClientProps) {
  const [activeTab, setActiveTab] = useState<string>("overview");

  const tabs = [
    {
      label: "Overview",
      value: "overview",
      content: <PartnerProfileOverview profile={profile} />,
    },
    {
      label: "Insights History",
      value: "insights-history",
      content: <InsightsHistoryTab />,
    },
    {
      label: "Special Things",
      value: "special-things",
      content: <SpecialThingsTab profile={profile} />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="container mx-auto max-w-2xl px-4 py-4">
          <PartnerProfileHeader profile={profile} />
        </div>
      </div>

      {/* Tabs & Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-2xl px-4">
          <div className="sticky top-0 z-10 border-b bg-background">
            <ProfileTab
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="sticky bottom-0 border-t bg-background">
        <div className="container mx-auto max-w-2xl px-4 py-4">
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" disabled={true}>
              Back
            </Button>
            <Button className="flex-1" disabled={true}>
              <Pencil className="size-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
