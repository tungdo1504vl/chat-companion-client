"use client";

import { useRouter } from "next/navigation";
import { OnboardingForm } from "@/features/onboarding/components";
import { useOnboarding } from "@/features/onboarding/hooks/use-onboarding";
import { TOnboardingFormData } from "@/features/onboarding/types";
import { TCommonPayload } from "@/services";
import { convertTo24HourFormat } from "@/utils";
import { PageHeader } from "@/components/commons/page-header";

export default function OnboardingPage() {
  const router = useRouter();
  const mutateOnboarding = useOnboarding();

  const handleBackClick = () => {
    router.back();
  };

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
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <PageHeader title="Onboarding" onBackClick={handleBackClick} />
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-2xl py-8 px-4">
          <OnboardingForm
            onSubmit={handleSubmit}
            isLoading={mutateOnboarding.isPending}
          />
        </div>
      </div>
    </div>
  );
}
