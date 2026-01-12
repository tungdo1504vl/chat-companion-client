"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingForm, AstrologyChartScreen } from "@/features/onboarding/components";
import { useOnboarding } from "@/features/onboarding/hooks/use-onboarding";
import { TOnboardingFormData } from "@/features/onboarding/types";
import { TCommonPayload } from "@/services";
import { convertTo24HourFormat } from "@/utils";
import { PageHeader } from "@/components/commons/page-header";
import { TopProgressBar } from "@/features/partner-form/components/top-progress-bar";
import { ProgressIndicator } from "@/features/partner-form/components/progress-indicator";
import { PROTECTED_ROUTES } from "@/constants/routes";

export default function OnboardingPage() {
  const router = useRouter();
  const mutateOnboarding = useOnboarding();
  const [currentStep, setCurrentStep] = useState(1);
  const [showChartScreen, setShowChartScreen] = useState(false);
  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;
  const stepTitles = ["Personal Information", "Birth Details", "Location"];

  const handleSubmit = async (formData: TOnboardingFormData) => {
    const birthDay = `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`;

    // Convert 12-hour format to 24-hour format when birth time is known
    // If birth time is unknown, default to 12:30 PM (12:30:00 in 24-hour format)
    const birthTime =
      formData.birthTimeKnown && formData.birthPeriod
        ? convertTo24HourFormat(
            formData.birthHour,
            formData.birthMinute,
            formData.birthPeriod
          )
        : "12:30:00";

    const payload: TCommonPayload = {
      task_type: "user_profile_validate",
      input_args: {
        name: formData.name,
        gender: formData.genderAtBirth,
        dob: birthDay,
        time_of_birth: birthTime,
        country_of_birth: formData.country || "",
        city_of_birth: formData.city,
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
    <div className="flex flex-col h-full bg-background">
      <PageHeader title="Onboarding" />
      <TopProgressBar progress={progress} />
      <div className="border-b bg-background px-4 py-3">
        <div className="container mx-auto max-w-2xl">
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
            stepTitles={stepTitles}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-2xl py-8 px-4">
          <OnboardingForm
            onSubmit={handleSubmit}
            isLoading={mutateOnboarding.isPending}
            onStepChange={setCurrentStep}
          />
        </div>
      </div>
    </div>
  );
}
