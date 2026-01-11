"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ProfileErrorStateProps {
  readonly error: Error | null;
  readonly onRetry?: () => void;
}

export default function ProfileErrorState({
  error,
  onRetry,
}: Readonly<ProfileErrorStateProps>) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Failed to load profile</AlertTitle>
        <AlertDescription className="mt-2">
          {error?.message || "Unable to load your profile. Please try again."}
        </AlertDescription>
        {onRetry && (
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        )}
      </Alert>
    </div>
  );
}
