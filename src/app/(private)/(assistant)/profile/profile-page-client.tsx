"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ProfileForm,
  BirthChart,
  ProfileHeader,
  ProfileFormSkeleton,
  ProfileErrorState,
  ProfileEmptyState,
} from "@/features/profile/user/components";
import { useProfileForm } from "@/features/profile/user/hooks/use-profile-form";
import { useUserProfile } from "@/features/profile/user/hooks/use-user-profile";
import { useUpdateUserImage } from "@/features/profile/user/hooks/use-update-user-image";
import { ImageUploadDialog } from "@/features/profile/common/components/image-upload-dialog";
import { ASSISTANT_ROUTES } from "@/constants/routes";

export default function ProfilePageClient() {
  const [activeTab, setActiveTab] = useState("settings");
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const {
    formData,
    isLoading,
    isFetching,
    error,
    handleSubmit,
    refetch,
    isSuccess,
  } = useProfileForm();
  const { user } = useUserProfile();
  const { updateImageAsync, isUpdating: isUpdatingImage } = useUpdateUserImage({
    onSuccess: () => {
      setIsImageDialogOpen(false);
      refetch?.();
    },
  });

  const handleRetry = () => {
    refetch?.();
  };

  const handleStart = () => {
    setActiveTab("settings");
  };

  const handleAvatarEditClick = () => {
    setIsImageDialogOpen(true);
  };

  const handleImageSelect = async (file: File) => {
    await updateImageAsync(file);
  };

  // Check if profile is empty (matches default values)
  // A profile is considered empty if all fields match default values
  const isEmpty =
    !isFetching &&
    !error &&
    formData &&
    formData.primaryLoveLanguage === "" &&
    formData.communicationStyles.length === 0 &&
    formData.attachmentStyle === "" &&
    formData.dealBreakers.length === 0 &&
    formData.workSchedule === "" &&
    formData.dateBudget === 10 && // Default value
    formData.socialEnergy === "" &&
    formData.hobbies.length === 0 &&
    formData.instagramUrl === "";

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Scrollable Content */}
      <div className="flex-1  overflow-y-auto">
        <ProfileHeader
          backHref={ASSISTANT_ROUTES.ASSISTANT}
          isLoading={isFetching}
          onAvatarEditClick={handleAvatarEditClick}
        />

        <div className="px-4 pb-6">
          {/* Loading State */}
          {isFetching && (
            <div className="mt-6">
              <ProfileFormSkeleton />
            </div>
          )}

          {/* Error State */}
          {error && !isFetching && (
            <div className="mt-6">
              <ProfileErrorState error={error} onRetry={handleRetry} />
            </div>
          )}

          {/* Empty State */}
          {isEmpty && !isFetching && !error && (
            <div className="mt-6">
              <ProfileEmptyState onStart={handleStart} />
            </div>
          )}

          {/* Content - Only show when loaded, no error, and has data */}
          {!isFetching && !error && !isEmpty && (
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
                  isSuccess={isSuccess}
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
          )}
        </div>
      </div>

      {/* Image Upload Dialog */}
      <ImageUploadDialog
        open={isImageDialogOpen}
        onOpenChange={setIsImageDialogOpen}
        onImageSelect={handleImageSelect}
        isUploading={isUpdatingImage}
        currentAvatarUrl={user?.image || undefined}
      />
    </div>
  );
}
