"use client";

import { useState } from "react";
import SplashScreenStep from "./splash-screen-step";
import {
  SPLASH_SCREEN_STEP_1_CONFIG,
  SPLASH_SCREEN_STEP_2_CONFIG,
} from "./splash-screen-config";
import { useRouter } from "next/navigation";

type SplashScreenStep = 1 | 2;

// Transition timing constants
const TRANSITION_DURATION_MS = 350; // Smooth 300-400ms transition

export default function SplashScreenContainer() {
  const [currentStep, setCurrentStep] = useState<SplashScreenStep>(1);
  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();

  const handleContinue = () => {
    if (currentStep === 1) {
      // Start fade-out transition
      setIsExiting(true);
    } else if (currentStep === 2) {
      // Handle final step completion if needed
      router.push("/onboarding");
    }
  };

  const handleTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    // Only handle opacity transitions to avoid conflicts
    if (event.propertyName !== "opacity") return;

    // When fade-out completes, switch to next step
    if (isExiting && currentStep === 1) {
      setCurrentStep(2);
      // Use requestAnimationFrame to ensure DOM update before fade-in
      requestAnimationFrame(() => {
        setIsExiting(false);
      });
    }
  };

  const getStepConfig = () => {
    return currentStep === 1
      ? SPLASH_SCREEN_STEP_1_CONFIG
      : SPLASH_SCREEN_STEP_2_CONFIG;
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <div
        className="transition-opacity ease-out motion-reduce:transition-none"
        style={{
          transitionDuration: `${TRANSITION_DURATION_MS}ms`,
          opacity: isExiting ? 0 : 1,
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        <SplashScreenStep config={getStepConfig()} onContinue={handleContinue} />
      </div>
    </div>
  );
}
