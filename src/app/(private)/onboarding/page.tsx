"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingForm, AstrologyChartScreen } from "@/features/onboarding/components";
import { useOnboarding } from "@/features/onboarding/hooks/use-onboarding";
import { TOnboardingFormData } from "@/features/onboarding/types";
import { TCommonPayload } from "@/services";
import { PROTECTED_ROUTES } from "@/constants/routes";
// Uncomment the line below to use mock data for testing the astrology chart screen
// import { useMockProfileAnalysis } from "@/features/onboarding/mock-data";

export default function OnboardingPage() {
  const router = useRouter();
  const mutateOnboarding = useOnboarding();
  const [showChartScreen, setShowChartScreen] = useState(false);

  // Uncomment to use mock data for testing (bypasses API call)
  // useMockProfileAnalysis();

  const handleSubmit = async (formData: TOnboardingFormData) => {
    // Default time to 12:30:00 (12:30 PM) when not provided
    const birthTime = "12:30:00";

    const payload: TCommonPayload = {
      task_type: "user_profile_validate",
      input_args: {
        name: formData.name,
        gender: formData.gender,
        dob: formData.dob,
        time_of_birth: birthTime,
        country_of_birth: formData.country || "",
        city_of_birth: "", // Not required in simplified form
      },
      priority: "high",
    };

    await mutateOnboarding.mutateAsync(payload);

    // Show chart screen after successful submission
    setShowChartScreen(true);
  };

  const handleNext = () => {
    router.push(PROTECTED_ROUTES.ASSISTANT);
    router.refresh();
  };

  // Show astrology chart screen if onboarding is complete
  if (showChartScreen) {
    return <AstrologyChartScreen onNext={handleNext} />;
  }

  return (
    <div className="flex flex-col h-full bg-[#FFF9F5]  dark:bg-[#1F1A1A]">
      <OnboardingForm
        onSubmit={handleSubmit}
        isLoading={mutateOnboarding.isPending}
      />
    </div>
  );
}
