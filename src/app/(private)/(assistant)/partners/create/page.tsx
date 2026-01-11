"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ASSISTANT_ROUTES } from "@/constants/routes";
import { PartnerForm } from "@/features/partner-form";
import { PageHeader } from "@/components/commons/page-header";
import { TopProgressBar } from "@/features/partner-form/components/top-progress-bar";
import { TPartnerFormData } from "@/features/partner-form/types";
import { toast } from "sonner";
import { TCommonPayload } from "@/types/common";
import { useCommonCompute } from "@/hooks/use-compute";
import { useSession } from "@/libs/better-auth/client";
import { TASK_TYPE } from "@/constants/task";
import { useQueryClient } from "@/libs/react-query";
import { ProgressIndicator } from "@/features/partner-form/components/progress-indicator";
import { convertTo24HourFormat } from "@/utils";

const STEP_TITLES = [
  "Partner's Basic Information",
  "Describe Your Current Situation",
  "What Do You Want to Achieve?",
  "Additional Information (Optional)",
];

export default function PartnerCreatePage() {
  const router = useRouter();
  const mutatePartner = useCommonCompute();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const userId = session?.user.id;
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleSubmit = async (formData: TPartnerFormData) => {
    console.log("Partner form data:", formData);
    if (!userId) return;

    // Show loading toast when mutation starts
    const loadingToastId = toast.loading("Creating partner profile...");

    try {
      // Format date of birth (YYYY-MM-DD) - following onboarding form pattern
      const dob =
        formData.birthYear && formData.birthMonth && formData.birthDay
          ? `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`
          : undefined;

      // Format time of birth (HH:mm:ss) if known - following onboarding form pattern
      const timeOfBirth =
        formData.birthTimeKnown &&
        formData.birthHour &&
        formData.birthMinute &&
        formData.birthPeriod
          ? convertTo24HourFormat(
              formData.birthHour,
              formData.birthMinute,
              formData.birthPeriod
            )
          : undefined;

      // Calculate age from age range (approximate conversion)
      const calculateAgeFromRange = (ageRange: string): number | undefined => {
        if (!ageRange || ageRange === "") return undefined;
        // Convert age range to approximate age
        if (ageRange === "Teens") return 17;
        if (ageRange === "Early 20s") return 22;
        if (ageRange === "Late 20s") return 27;
        if (ageRange === "30s") return 35;
        if (ageRange === "40+") return 45;
        return undefined;
      };

      // Build basic_info object, excluding undefined values
      const basicInfo: Record<string, string | number> = {
        name: formData.partnerName,
      };
      if (formData.partnerGender) {
        basicInfo.gender = formData.partnerGender;
      }
      const age = calculateAgeFromRange(formData.partnerAgeRange);
      if (age !== undefined) {
        basicInfo.age = age;
      }
      if (dob) {
        basicInfo.dob = dob;
      }
      if (timeOfBirth) {
        basicInfo.time_of_birth = timeOfBirth;
      }
      if (formData.country) {
        basicInfo.country_of_birth = formData.country;
      }
      if (formData.city) {
        basicInfo.city_of_birth = formData.city;
      }

      // Build partner_profile object, excluding undefined values
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const partner_profile: any = {
        basic_info: basicInfo,
        current_situation: formData.situationDescription,
      };
      if (formData.keyQuestion) {
        partner_profile.what_you_want = formData.keyQuestion;
      }
      if (formData.goalForRelationship) {
        partner_profile.what_ultimately_want = formData.goalForRelationship;
        partner_profile.goals = [formData.goalForRelationship];
      }
      if (formData.partnerPersonality) {
        partner_profile.partner_personality = formData.partnerPersonality;
      }
      if (formData.majorPastEvents) {
        partner_profile.past_events_summary = formData.majorPastEvents;
      }
      if (formData.currentFeelings) {
        partner_profile.current_feelings = formData.currentFeelings;
      }

      const payload: TCommonPayload = {
        task_type: TASK_TYPE.PARTNER_PROFILE_CREATE,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        input_args: {
          user_id: userId,
          partner_profile: partner_profile,
        } as any,
        priority: "high",
      };
      const res = await mutatePartner.mutateAsync(payload);
      console.log("res:", res);
      await queryClient.invalidateQueries({
        queryKey: ["compute", TASK_TYPE.PARTNER_PROFILE_LIST],
      });

      // Dismiss loading toast and show success
      toast.dismiss(loadingToastId);
      toast.success("Partner created successfully");

      // Navigate to partners page after form submission
      router.push(ASSISTANT_ROUTES.PARTNERS);
    } catch (error) {
      // Dismiss loading toast and show error
      toast.dismiss(loadingToastId);
      console.error("Failed to create partner:", error);
      toast.error("Failed to create partner", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="Create Partner" onBackClick={() => router.back()} />
      <TopProgressBar progress={progress} />
      <div className="container mx-auto max-w-2xl py-8 px-4">
        <div className="mb-6">
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
            stepTitles={STEP_TITLES}
          />
        </div>
        <PartnerForm onSubmit={handleSubmit} onStepChange={setCurrentStep} />
      </div>
    </div>
  );
}
