"use client";

import { UserPlus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileEmptyStateProps {
  readonly onStart?: () => void;
}

export default function ProfileEmptyState({
  onStart,
}: Readonly<ProfileEmptyStateProps>) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4 text-center">
      <div className="max-w-md space-y-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-4">
            <UserPlus className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Create Your Profile</h2>
          <p className="text-muted-foreground">
            Tell us about yourself to get personalized insights and better
            recommendations. Your profile helps us understand your preferences,
            communication style, and what matters most to you.
          </p>
        </div>
        {onStart && (
          <Button onClick={onStart} className="mt-4">
            Get Started
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
