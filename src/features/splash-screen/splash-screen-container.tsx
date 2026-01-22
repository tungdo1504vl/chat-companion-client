"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SplashScreenStep from "./splash-screen-step";
import {
  SPLASH_SCREEN_STEP_1_CONFIG,
  SPLASH_SCREEN_STEP_2_CONFIG,
} from "./splash-screen-config";
import { useRouter } from "next/navigation";
import Link from "next/link";

type SplashScreenStep = 1 | 2;

// Transition timing constants
const TRANSITION_DURATION_MS = 350; // Smooth 300-400ms transition

// Animation variants for framer-motion
const stepVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const transitionConfig = {
  duration: TRANSITION_DURATION_MS / 1000,
  ease: [0.4, 0, 0.2, 1] as const, // easeOut cubic bezier
};

export default function SplashScreenContainer() {
  const [currentStep, setCurrentStep] = useState<SplashScreenStep>(2);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  // Preload onboarding route during step 2
  useEffect(() => {
    if (currentStep === 2) {
      // Prefetch the onboarding route for faster navigation
      router.prefetch("/onboarding");
    }
  }, [currentStep, router]);

  const handleContinue = () => {
    if (currentStep === 1) {
      // Move to step 2
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Start exit animation before navigation
      setIsNavigating(true);
      // Navigate after a brief delay to allow exit animation
      setTimeout(() => {
        router.push("/onboarding");
      }, TRANSITION_DURATION_MS);
    }
  };

  const getStepConfig = () => {
    return currentStep === 1
      ? SPLASH_SCREEN_STEP_1_CONFIG
      : SPLASH_SCREEN_STEP_2_CONFIG;
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Preload onboarding route link (hidden) */}
      <Link href="/onboarding" prefetch className="hidden" aria-hidden="true" />

      <AnimatePresence mode="wait">
        {!isNavigating && (
          <motion.div
            key={currentStep}
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transitionConfig}
            className="w-full h-full"
          >
            <SplashScreenStep config={getStepConfig()} onContinue={handleContinue} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
