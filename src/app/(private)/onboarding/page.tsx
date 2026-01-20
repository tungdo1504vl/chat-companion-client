"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { OnboardingForm, AstrologyChartScreen } from "@/features/onboarding/components";
import { useOnboarding } from "@/features/onboarding/hooks/use-onboarding";
import { TOnboardingFormData } from "@/features/onboarding/types";
import { TCommonPayload } from "@/services";
import { PROTECTED_ROUTES } from "@/constants/routes";
import Link from "next/link";

// Transition timing constants (matches splash screen)
const TRANSITION_DURATION_MS = 350;

// Animation variants for smooth entrance
const pageVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
  },
};

const pageTransition = {
  duration: TRANSITION_DURATION_MS / 1000,
  ease: [0.4, 0, 0.2, 1] as const, // easeOut cubic bezier
};

export default function OnboardingPage() {
  const router = useRouter();
  const mutateOnboarding = useOnboarding();
  const [showChartScreen, setShowChartScreen] = useState(false);

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

    try {
      // The mutation uses mock data internally (see use-onboarding.ts)
      await mutateOnboarding.mutateAsync(payload);

      // Show chart screen after successful submission
      // The mock data is already set in the store via onSuccess callback
      setShowChartScreen(true);
    } catch (error) {
      // Error handling is done in the mutation's onError callback
      console.error("Onboarding submission failed:", error);
    }
  };

  const handleNext = () => {
    router.push(PROTECTED_ROUTES.ASSISTANT);
    router.refresh();
  };

  // Show astrology chart screen if onboarding is complete
  if (showChartScreen) {
    return (
      <>
        <Link href="/assistant" prefetch className="hidden" aria-hidden="true" />
        <motion.div
          initial="initial"
          animate="animate"
          variants={pageVariants}
          transition={pageTransition}
        >
          <AstrologyChartScreen onNext={handleNext} />
        </motion.div>
      </>

    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pageVariants}
      transition={pageTransition}
      className="flex flex-col h-full bg-[#FFF9F5] dark:bg-[#1F1A1A]"
    >
      <OnboardingForm
        onSubmit={handleSubmit}
        isLoading={mutateOnboarding.isPending}
      />
    </motion.div>
  );
}
