"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ProfileForm,
  BirthChart,
  ProfileHeader,
} from "@/features/profile/user/components";
import { useProfileForm } from "@/features/profile/user/hooks/use-profile-form";
import { useUserProfile } from "@/features/profile/user/hooks/use-user-profile";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("settings");

  const { formData, isLoading, handleSubmit } = useProfileForm();
  const { user } = useUserProfile();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <ProfileHeader onBackClick={handleBackClick} />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pb-6">
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-2 bg-muted">
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Settings
              </TabsTrigger>
              <TabsTrigger
                value="birth-chart"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Birth Chart
              </TabsTrigger>
            </TabsList>

            {/* Settings Tab */}
            <TabsContent value="settings" className="mt-6">
              <ProfileForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                defaultValues={formData}
              />
            </TabsContent>

            {/* Birth Chart Tab */}
            <TabsContent value="birth-chart" className="mt-6">
              <BirthChart
                natalChart={user?.natal_chart ?? null}
                insights={user?.insights ?? null}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
