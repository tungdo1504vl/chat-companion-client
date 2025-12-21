import { createStore } from "zustand/vanilla";
import { devtools } from "zustand/middleware";
import type { PartnerProfile } from "../types";

// State interface - separate from actions for better type safety
export interface PartnerProfileState {
  draftProfile: PartnerProfile | null;
  savedProfile: PartnerProfile | null;
  isSaving: boolean;
  error: string | null;
}

// Actions interface
export interface PartnerProfileActions {
  initialize: (profile: PartnerProfile) => void;
  updateField: <K extends keyof PartnerProfile>(
    field: K,
    value: PartnerProfile[K],
    aiFlagField?: keyof PartnerProfile
  ) => void;
  setSavedProfile: (profile: PartnerProfile) => void;
  resetToSaved: () => void;
  setIsSaving: (isSaving: boolean) => void;
  setError: (error: string | null) => void;
}

// Combined store interface
export type PartnerProfileStore = PartnerProfileState & PartnerProfileActions;

// Default initial state
export const defaultInitState: PartnerProfileState = {
  draftProfile: null,
  savedProfile: null,
  isSaving: false,
  error: null,
};

// Helper function to deep compare profiles (more efficient than JSON.stringify)
// Exported for use in provider
export function profilesEqual(
  profile1: PartnerProfile | null,
  profile2: PartnerProfile | null
): boolean {
  if (!profile1 || !profile2) return profile1 === profile2;
  if (profile1.id !== profile2.id) return false;

  // Compare key fields that matter for unsaved changes
  const keys: (keyof PartnerProfile)[] = [
    "goals",
    "loveLanguage",
    "communicationStyles",
    "attachmentTendency",
    "dealBreakers",
    "appreciatedThings",
    "workRhythm",
    "socialEnergyLevel",
    "dateBudget",
    "hobbies",
    "favoriteHobbies",
    "socialSignals",
    "specialDays",
  ];

  return keys.every((key) => {
    const val1 = profile1[key];
    const val2 = profile2[key];

    if (Array.isArray(val1) && Array.isArray(val2)) {
      return (
        val1.length === val2.length &&
        val1.every((item, index) => item === val2[index])
      );
    }

    return JSON.stringify(val1) === JSON.stringify(val2);
  });
}

// Store creator function - follows Zustand Next.js best practices
// Creates a new store instance per request/component
export const createPartnerProfileStore = (
  initState: PartnerProfileState = defaultInitState
) => {
  return createStore<PartnerProfileStore>()(
    devtools(
      (set, get) => ({
        ...initState,

        // Actions
        initialize: (profile: PartnerProfile) => {
          set(
            {
              draftProfile: { ...profile },
              savedProfile: { ...profile },
              error: null,
            },
            false,
            "initialize"
          );
        },

        updateField: <K extends keyof PartnerProfile>(
          field: K,
          value: PartnerProfile[K],
          aiFlagField?: keyof PartnerProfile
        ) => {
          const { draftProfile } = get();
          if (!draftProfile) return;

          const updated = { ...draftProfile, [field]: value };

          // Clear AI flag if user manually edits
          if (aiFlagField && aiFlagField in updated) {
            (updated as Record<string, unknown>)[aiFlagField as string] = false;
          }

          set(
            { draftProfile: updated, error: null },
            false,
            `updateField:${String(field)}`
          );
        },

        setSavedProfile: (profile: PartnerProfile) => {
          set(
            {
              savedProfile: { ...profile },
              draftProfile: { ...profile },
              error: null,
            },
            false,
            "setSavedProfile"
          );
        },

        resetToSaved: () => {
          const { savedProfile } = get();
          if (!savedProfile) return;
          set(
            {
              draftProfile: { ...savedProfile },
              error: null,
            },
            false,
            "resetToSaved"
          );
        },

        setIsSaving: (isSaving: boolean) => {
          set({ isSaving }, false, "setIsSaving");
        },

        setError: (error: string | null) => {
          set({ error }, false, "setError");
        },
      }),
      { name: "PartnerProfileStore" }
    )
  );
};

// Export store API type for use in provider
export type PartnerProfileStoreApi = ReturnType<
  typeof createPartnerProfileStore
>;
