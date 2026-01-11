"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ProfileSaveButtonProps {
  readonly hasChanges: boolean;
  readonly isValid: boolean;
  readonly isLoading: boolean;
  readonly isSuccess?: boolean;
  readonly onSave: () => void;
  readonly onReset?: () => void;
}

export default function ProfileSaveButton({
  hasChanges,
  isValid,
  isLoading,
  isSuccess = false,
  onSave,
  onReset,
}: Readonly<ProfileSaveButtonProps>) {
  const [showSaved, setShowSaved] = useState(false);

  // Show "Saved" state temporarily when save succeeds
  useEffect(() => {
    if (isSuccess) {
      setShowSaved(true);
      const timer = setTimeout(() => {
        setShowSaved(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const isDisabled = !hasChanges || !isValid || isLoading;

  const renderButtonContent = () => {
    if (isLoading) {
      return (
        <motion.span
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex items-center"
        >
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Saving...
        </motion.span>
      );
    }

    if (showSaved) {
      return (
        <motion.span
          key="saved"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex items-center"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              delay: 0.05,
            }}
          >
            <Check className="h-4 w-4 mr-2" />
          </motion.span>
          Saved
        </motion.span>
      );
    }

    return (
      <motion.span
        key="default"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        Save Profile
      </motion.span>
    );
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t p-4">
      <div className="flex gap-2">
        {onReset && (
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            disabled={isLoading}
            onClick={onReset}
          >
            Reset
          </Button>
        )}
        <Button
          type="button"
          variant="default"
          className="flex-1 bg-primary transition-all duration-200 ease-out"
          disabled={isDisabled}
          onClick={onSave}
        >
          <AnimatePresence mode="wait" initial={false}>
            {renderButtonContent()}
          </AnimatePresence>
        </Button>
      </div>
    </div>
  );
}
