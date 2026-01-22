"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { PrimaryActionButton } from "@/components/commons/primary-action-button";
import type { SplashScreenStepConfig } from "./splash-screen-config";

interface SplashScreenStepProps {
  readonly config: SplashScreenStepConfig;
  readonly onContinue?: () => void;
}

export default function SplashScreenStep({
  config,
  onContinue,
}: SplashScreenStepProps) {
  return (
    <>
      <main className="grow flex flex-col items-center justify-between px-6 pb-10 relative z-10 w-full max-w-md mx-auto min-h-screen">
        <div className="flex flex-col items-center justify-center grow w-full">
          <div className="mt-2 mb-8 text-center">
            <span className={config.badge.className}>{config.badge.text}</span>
          </div>
          <div className="mb-10 relative group">
            <div className="absolute inset-0 bg-primary opacity-20 blur-xl rounded-full scale-110 group-hover:scale-125 transition-transform duration-200 ease-out motion-reduce:transition-none motion-reduce:group-hover:scale-110"></div>
            <div className="w-32 h-32 rounded-full p-1 bg-white dark:bg-card-dark shadow-soft relative overflow-hidden mx-auto transition-all duration-200 ease-out">
              <Image
                alt={config.avatar.alt}
                src={config.avatar.src}
                width={config.avatar.size}
                height={config.avatar.size}
                priority
                className="w-full h-full object-cover rounded-full filter saturate-[0.85] contrast-[1.1]"
              />
            </div>
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-center font-bold mb-6 leading-tight text-gray-900 dark:text-gray-100">
            {config.heading.main === "Your Heart's" ? (
              <>
                Your Heart's <br /> Best{" "}
                <span className="text-primary italic">
                  {config.heading.highlight}
                </span>{" "}
                Companion
              </>
            ) : (
              <>
                {config.heading.main} <br />{" "}
                <span className="text-primary ">
                  {config.heading.highlight}
                </span>
              </>
            )}
          </h1>
          <p className="text-center text-text-sub-light dark:text-text-sub-dark font-display mb-4 text-lg md:text-xl opacity-90 leading-relaxed max-w-[340px]">
            {config.description}
          </p>
        </div>
        <div className="w-full mb-4">
          <PrimaryActionButton
            onClick={onContinue}
            aria-label="Continue to next step"
            label={config.button.text}
            icon={<Heart />}
            className="size-full"
          />
        </div>
      </main>
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[30%] bg-primary/10 rounded-full blur-3xl dark:opacity-20"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[20%] bg-orange-200/20 rounded-full blur-3xl dark:bg-primary/10"></div>
      </div>
    </>
  );
}
