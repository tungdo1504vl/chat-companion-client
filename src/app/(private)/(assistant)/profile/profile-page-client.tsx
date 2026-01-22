"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ProfileForm,
  BirthChart,
  ProfileFormSkeleton,
  ProfileErrorState,
  ProfileEmptyState,
} from "@/features/profile/user/components";
import { ProfileInfo } from "@/features/profile/common/header";
import { PageHeader } from "@/components/commons/page-header";
import { useProfileForm } from "@/features/profile/user/hooks/use-profile-form";
import { useUserStoreState } from "@/stores/user/provider";
import { useSession } from "@/libs/better-auth/client";
import { useUpdateUserImage } from "@/features/profile/user/hooks/use-update-user-image";
import { ImageUploadDialog } from "@/features/profile/common/components/image-upload-dialog";
import { ASSISTANT_ROUTES } from "@/constants/routes";

export default function ProfilePageClient() {
  const router = useRouter();
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

  const userInfo = useUserStoreState((state) => state.userInfo);
  const loadUserInfo = useUserStoreState((state) => state.loadUserInfo);
  const { data: session } = useSession();

  // Calculate age from DOB
  const age = useMemo(() => {
    const dob = userInfo?.profile?.basic_info?.dob;
    if (!dob) return undefined;

    const birthDate = new Date(dob);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      calculatedAge--;
    }
    return calculatedAge;
  }, [userInfo?.profile?.basic_info?.dob]);

  // Format location from city and country
  const location = useMemo(() => {
    const city = userInfo?.profile?.basic_info?.city_of_birth;
    const country = userInfo?.profile?.basic_info?.country_of_birth;
    if (!city && !country) return undefined;
    if (city && country) return `${city}, ${country}`;
    return city || country;
  }, [
    userInfo?.profile?.basic_info?.city_of_birth,
    userInfo?.profile?.basic_info?.country_of_birth,
  ]);

  // Get user display name
  const userName = useMemo(() => {
    return userInfo?.profile?.basic_info?.name || session?.user?.name || "";
  }, [userInfo?.profile?.basic_info?.name, session?.user?.name]);

  // Get avatar URL
  const avatarUrl = useMemo(() => {
    return (
      userInfo?.profile?.basic_info?.avatar_url || session?.user?.image || undefined
    );
  }, [userInfo?.profile?.basic_info?.avatar_url, session?.user?.image]);

  // Get initials
  const initials = useMemo(() => {
    return userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }, [userName]);

  // Load user info on mount if not already loaded
  useEffect(() => {
    if (!userInfo && !isFetching) {
      loadUserInfo();
    }
  }, [userInfo, isFetching, loadUserInfo]);

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
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <PageHeader
          smallTitle
          title="My Profile"
          onBackClick={() => router.push(ASSISTANT_ROUTES.ASSISTANT)}
          backHref={ASSISTANT_ROUTES.ASSISTANT}
        />
        <main className="max-w-md mx-auto px-4 space-y-6">
          {/* Profile Info */}
          <ProfileInfo
            name={userName}
            avatarUrl={avatarUrl}
            initials={initials}
            age={age}
            location={location}
            isLoading={isFetching}
            onAvatarEditClick={handleAvatarEditClick}
          />
        </main>

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
              <TabsList className="w-full h-14 grid grid-cols-2 bg-muted">
                <TabsTrigger
                  value="settings"
                  className="data-[state=active]:bg-primary  py-3  data-[state=active]:text-primary-foreground"
                >
                  Settings
                </TabsTrigger>
                <TabsTrigger
                  value="birth-chart"
                  className="data-[state=active]:bg-primary  py-3  data-[state=active]:text-primary-foreground"
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
                  natalChart={userInfo?.natal_chart ?? null}
                  insights={userInfo?.insights ?? null}
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
        currentAvatarUrl={avatarUrl}
      />
    </div>
  );
}
