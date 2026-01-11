"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { usePartnerProfileStore } from "../partner/store/hooks";
import { profilesEqual } from "../partner/store/partner-profile-store";
import { useUpdatePartnerProfile } from "../partner/hooks/use-update-partner-profile";
import type {
  PartnerProfile,
  GoalType,
  LoveLanguage,
  CommunicationStyle,
  DealBreaker,
  WorkRhythm,
  SocialEnergyLevel,
  DateBudget,
  Hobby,
  SocialSignal,
  SpecialDay,
  AttachmentTendencyData,
} from "../partner/types";

export interface UsePartnerProfileFormReturn {
  // State
  draftProfile: PartnerProfile | null;
  savedProfile: PartnerProfile | null;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  error: string | null;

  // Update handlers
  updateHandlers: {
    onGoalsChange: (goals: GoalType[]) => void;
    onLoveLanguageChange: (loveLanguage: LoveLanguage) => void;
    onCommunicationStylesChange: (styles: CommunicationStyle[]) => void;
    onAttachmentTendencyChange: (tendency: AttachmentTendencyData) => void;
    onDealBreakersChange: (dealBreakers: DealBreaker[]) => void;
    onAppreciatedThingsChange: (things: string[]) => void;
    onWorkRhythmChange: (rhythm: WorkRhythm) => void;
    onSocialEnergyChange: (energy: SocialEnergyLevel) => void;
    onDateBudgetChange: (budget: DateBudget) => void;
    onHobbiesChange: (hobbies: Hobby[]) => void;
    onFavoriteHobbiesChange: (favorites: Hobby[]) => void;
    onSocialSignalsChange: (signals: SocialSignal[]) => void;
    onInstagramUrlChange: (url: string) => void;
    onSpecialDaysChange: (days: SpecialDay[] | undefined) => void;
  };

  // Actions
  handleSave: () => Promise<void>;
  handleReset: () => void;
}

/**
 * Custom hook for managing partner profile form state
 * Uses Zustand for state management and provides update handlers
 */
export function usePartnerProfileForm(
  initialProfile: PartnerProfile
): UsePartnerProfileFormReturn {
  // Get state from store using selectors
  const draftProfile = usePartnerProfileStore((state) => state.draftProfile);
  const savedProfile = usePartnerProfileStore((state) => state.savedProfile);
  const isSaving = usePartnerProfileStore((state) => state.isSaving);
  const error = usePartnerProfileStore((state) => state.error);
  const hasUnsavedChanges = usePartnerProfileStore((state) => {
    return !profilesEqual(state.draftProfile, state.savedProfile);
  });

  const setSavedProfile = usePartnerProfileStore(
    (state) => state.setSavedProfile
  );
  const setIsSaving = usePartnerProfileStore((state) => state.setIsSaving);
  const setError = usePartnerProfileStore((state) => state.setError);
  const resetToSaved = usePartnerProfileStore((state) => state.resetToSaved);
  const initialize = usePartnerProfileStore((state) => state.initialize);
  const updateFieldFromStore = usePartnerProfileStore(
    (state) => state.updateField
  );

  // Use the update mutation hook
  const updateMutation = useUpdatePartnerProfile({
    onSuccess: (data) => {
      // Update the saved profile in the store with the draft profile
      // The API response might contain the updated profile, but we'll use the draft
      // since we already have it transformed correctly
      if (draftProfile) {
        setSavedProfile(draftProfile);
      }
      toast.success("Profile saved successfully");
    },
    onError: (err) => {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save profile";
      setError(errorMessage);
      toast.error(errorMessage);
    },
  });

  // Sync mutation's isPending with store's isSaving
  useEffect(() => {
    if (updateMutation.isPending !== isSaving) {
      setIsSaving(updateMutation.isPending);
    }
  }, [updateMutation.isPending, isSaving, setIsSaving]);

  console.log("initialProfile", initialProfile);
  // Initialize store on mount or when profile ID changes
  useEffect(() => {
    // Initialize if no saved profile exists, or if the profile ID has changed
    if (!savedProfile || savedProfile.id !== initialProfile.id) {
      initialize(initialProfile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProfile.id]);

  // Generic update handler
  const updateField = <K extends keyof PartnerProfile>(
    field: K,
    value: PartnerProfile[K],
    aiFlagField?: keyof PartnerProfile
  ) => {
    updateFieldFromStore(field, value, aiFlagField);
  };

  // Specific update handlers
  const updateHandlers = {
    onGoalsChange: (goals: GoalType[]) => {
      updateField("goals", goals, "goalsIsAiGenerated");
    },

    onLoveLanguageChange: (loveLanguage: LoveLanguage) => {
      updateField("loveLanguage", loveLanguage, "loveLanguageIsAiGenerated");
    },

    onCommunicationStylesChange: (styles: CommunicationStyle[]) => {
      updateField(
        "communicationStyles",
        styles,
        "communicationStylesIsAiGenerated"
      );
    },

    onAttachmentTendencyChange: (tendency: AttachmentTendencyData) => {
      if (!draftProfile) return;
      const updated = {
        ...draftProfile,
        attachmentTendency: {
          ...tendency,
          isAiGenerated: false,
        },
      };
      updateField("attachmentTendency", updated.attachmentTendency);
    },

    onDealBreakersChange: (dealBreakers: DealBreaker[]) => {
      updateField("dealBreakers", dealBreakers);
    },

    onAppreciatedThingsChange: (things: string[]) => {
      updateField(
        "appreciatedThings",
        things,
        "appreciatedThingsIsAiGenerated"
      );
    },

    onWorkRhythmChange: (rhythm: WorkRhythm) => {
      updateField("workRhythm", rhythm, "workRhythmIsAiGenerated");
    },

    onSocialEnergyChange: (energy: SocialEnergyLevel) => {
      updateField(
        "socialEnergyLevel",
        energy,
        "socialEnergyLevelIsAiGenerated"
      );
    },

    onDateBudgetChange: (budget: DateBudget) => {
      updateField("dateBudget", budget, "dateBudgetIsAiGenerated");
    },

    onHobbiesChange: (hobbies: Hobby[]) => {
      updateField("hobbies", hobbies, "hobbiesIsAiGenerated");
    },

    onFavoriteHobbiesChange: (favorites: Hobby[]) => {
      updateField("favoriteHobbies", favorites);
    },

    onSocialSignalsChange: (signals: SocialSignal[]) => {
      if (!draftProfile) return;
      const updated = {
        ...draftProfile,
        socialSignals: signals.map((signal) => ({
          ...signal,
          isAiGenerated: false,
        })),
      };
      updateField("socialSignals", updated.socialSignals);
    },

    onInstagramUrlChange: (url: string) => {
      updateField("instagramUrl", url);
    },

    onSpecialDaysChange: (days: SpecialDay[] | undefined) => {
      updateField("specialDays", days);
    },
  };

  // Save handler - uses the update mutation hook
  // Sends only changed fields by comparing draft with saved profile
  const handleSave = async () => {
    if (!draftProfile || !savedProfile || !hasUnsavedChanges) return;

    setError(null);
    // Pass both draft and saved profiles to compute diff and send only changed fields
    updateMutation.mutate({ draft: draftProfile, saved: savedProfile });
  };

  // Reset handler
  const handleReset = () => {
    resetToSaved();
    toast.info("Changes discarded");
  };

  return {
    draftProfile,
    savedProfile,
    // Use mutation's isPending for accurate saving state
    isSaving: updateMutation.isPending || isSaving,
    hasUnsavedChanges,
    error,
    updateHandlers,
    handleSave,
    handleReset,
  };
}
