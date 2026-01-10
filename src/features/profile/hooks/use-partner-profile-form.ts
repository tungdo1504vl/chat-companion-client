"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { usePartnerProfileStore } from "../partner/store/hooks";
import { profilesEqual } from "../partner/store/partner-profile-store";
import { savePartnerProfile } from "../partner/api/partner-profile-api";
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
  //   const actions = usePartnerProfileStore((state) => ({
  //     initialize: state.initialize,
  //     updateField: state.updateField,
  //     setSavedProfile: state.setSavedProfile,
  //     resetToSaved: state.resetToSaved,
  //     setIsSaving: state.setIsSaving,
  //     setError: state.setError,
  //   }));

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

    onSpecialDaysChange: (days: SpecialDay[] | undefined) => {
      updateField("specialDays", days);
    },
  };

  // Save handler
  const handleSave = async () => {
    if (!draftProfile || !hasUnsavedChanges) return;

    setIsSaving(true);
    setError(null);

    try {
      const response = await savePartnerProfile(draftProfile);
      setSavedProfile(response.profile);
      toast.success(response.message || "Profile saved successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save profile";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset handler
  const handleReset = () => {
    resetToSaved();
    toast.info("Changes discarded");
  };

  return {
    draftProfile,
    savedProfile,
    isSaving,
    hasUnsavedChanges,
    error,
    updateHandlers,
    handleSave,
    handleReset,
  };
}
