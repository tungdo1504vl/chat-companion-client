"use client";

import { useEffect, useRef, useState, useMemo, useId } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { Brain, Coffee, ChevronDown, Plus, Settings, Sparkles, Zap } from "lucide-react";
import { siInstagram } from "simple-icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  defaultProfileFormValues,
  loveLanguages,
  attachmentStyles,
  socialEnergyLevels,
} from "../const";
import { DEAL_BREAKER_OPTIONS, DATE_BUDGET_LABELS, DATE_BUDGET_TO_VALUE } from "@/features/profile/partner/const";
import { profileFormSchema } from "../validate-schema";
import { TProfileFormProps, TProfileFormData } from "../types";
import { cn } from "@/libs/tailwind/utils";

/**
 * Instagram icon component using simple-icons
 * Renders the Instagram brand icon with Instagram's gradient colors
 */
function InstagramIcon({ className }: Readonly<{ className?: string }>) {
  const viewBoxRegex = /viewBox="([^"]*)"/;
  const viewBoxMatch = viewBoxRegex.exec(siInstagram.svg);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 24 24";
  const gradientId = useId();

  return (
    <svg
      className={className}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Instagram"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#833AB4" />
          <stop offset="50%" stopColor="#FD1D1D" />
          <stop offset="100%" stopColor="#FCB045" />
        </linearGradient>
      </defs>
      <path d={siInstagram.path} fill={`url(#${gradientId})`} />
    </svg>
  );
}

/**
 * Deep equality comparison for form values
 * Handles arrays, objects, and primitives
 */
function deepEqual(a: TProfileFormData, b: TProfileFormData): boolean {
  // Quick reference check
  if (a === b) return true;

  // Compare arrays
  const compareArrays = (arr1: unknown[], arr2: unknown[]): boolean => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((val, idx) => val === arr2[idx]);
  };

  // Compare each field
  if (
    a.primaryLoveLanguage !== b.primaryLoveLanguage ||
    a.attachmentStyle !== b.attachmentStyle ||
    a.workSchedule !== b.workSchedule ||
    a.socialEnergy !== b.socialEnergy ||
    a.dateBudget !== b.dateBudget ||
    a.instagramUrl !== b.instagramUrl
  ) {
    return false;
  }

  // Compare array fields
  if (!compareArrays(a.communicationStyles, b.communicationStyles)) {
    return false;
  }
  if (!compareArrays(a.dealBreakers, b.dealBreakers)) {
    return false;
  }
  if (!compareArrays(a.hobbies, b.hobbies)) {
    return false;
  }

  return true;
}

// Helper functions for date budget conversion
function convertDateBudgetToPosition(value: number): "low" | "balanced" | "high" {
  if (value <= 50) return "low";
  if (value <= 150) return "balanced";
  return "high";
}

function convertDateBudgetPositionToValue(position: "low" | "balanced" | "high"): number {
  return DATE_BUDGET_TO_VALUE[position] ?? 50;
}

// Work schedule mapping
const WORK_RHYTHM_OPTIONS = [
  { value: "nine_to_five", label: "Busy / Set Hours", partnerValue: "busy_set_hours" },
  { value: "flexible_remote", label: "Flexible", partnerValue: "flexible" },
] as const;

// Social energy mapping
const SOCIAL_ENERGY_MAPPING = {
  low: "introvert",
  balanced: "balanced",
  high: "extrovert",
} as const;

const SOCIAL_ENERGY_REVERSE_MAPPING = {
  introvert: "low",
  balanced: "balanced",
  extrovert: "high",
} as const;

export default function ProfileForm(props: Readonly<TProfileFormProps>) {
  const { onSubmit, isLoading, isSuccess, defaultValues } = props;
  const previousValuesRef = useRef<string | undefined>(undefined);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [dealBreakerPopoverOpen, setDealBreakerPopoverOpen] = useState(false);
  const [loveLanguagePopoverOpen, setLoveLanguagePopoverOpen] = useState(false);

  // Track initial values for change detection
  const initialValuesRef = useRef<TProfileFormData>(
    defaultValues
      ? { ...defaultProfileFormValues, ...defaultValues }
      : defaultProfileFormValues
  );

  const form = useForm({
    defaultValues: {
      ...defaultProfileFormValues,
      ...defaultValues,
    },
    validators: {
      // @tanstack/react-form supports Zod schema directly but types are not fully compatible
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onBlur: profileFormSchema as unknown as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSubmit: profileFormSchema as unknown as any,
    },
  });

  // Reset form when defaultValues change (e.g., when profile data is fetched)
  useEffect(() => {
    if (defaultValues) {
      const currentValuesString = JSON.stringify(defaultValues);
      // Only reset if values actually changed
      if (previousValuesRef.current !== currentValuesString) {
        const newInitialValues = {
          ...defaultProfileFormValues,
          ...defaultValues,
        };
        form.reset(newInitialValues);
        initialValuesRef.current = newInitialValues;
        previousValuesRef.current = currentValuesString;
      }
    }
  }, [defaultValues, form]);

  // Track form values for change detection
  const formValues = useStore(form.store, (state) => state.values);

  // Compute hasChanges using deep equality comparison
  const hasChanges = useMemo(() => {
    return !deepEqual(formValues, initialValuesRef.current);
  }, [formValues]);

  const isValid = useStore(form.store, (state) => state.isValid);

  const handleFormSubmit = async () => {
    // Validate form before submitting
    await form.validateAllFields("submit");

    // Check if form is valid
    if (!form.state.isValid) {
      return;
    }

    const value = form.state.values;
    onSubmit?.(value);
  };

  const handleResetClick = () => {
    if (hasChanges) {
      setShowResetDialog(true);
    } else {
      handleReset();
    }
  };

  const handleReset = () => {
    // Reset form to initial values
    form.reset(initialValuesRef.current);
    setShowResetDialog(false);
  };

  return (
    <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
      {/* Success Message */}
      {/* {isSuccess && (
        <Alert className="mb-6 border-green-500/50 bg-green-50/50 dark:bg-green-950/10 animate-in fade-in-0 duration-200">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-700 dark:text-green-300">
            Profile saved successfully!
          </AlertDescription>
        </Alert>
      )} */}

      {/* Form Content */}
      <div className="space-y-6">
        {/* Personality & Preference */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Brain className="text-primary text-xl" />
            <h3 className="font-display text-xl font-bold">Personality & Preference</h3>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm space-y-6">
            {/* Love Language */}
            <form.Field name="primaryLoveLanguage">
              {(field) => {
                const getLoveLanguageLabel = (value?: string): string => {
                  if (!value) return "";
                  const option = loveLanguages.find((opt) => opt.value === value);
                  return option?.label || value;
                };

                return (
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-3">Love Language</p>
                    <Popover open={loveLanguagePopoverOpen} onOpenChange={setLoveLanguagePopoverOpen}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          disabled={isLoading}
                          className="w-full flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="text-sm font-medium">
                            {getLoveLanguageLabel(field.state.value) || "Select..."}
                          </span>
                          <ChevronDown className="text-slate-400" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-2">
                        <div className="flex flex-col gap-1">
                          {loveLanguages.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                field.handleChange(option.value);
                                field.handleBlur();
                                setLoveLanguagePopoverOpen(false);
                              }}
                              className="text-left px-2 py-1.5 text-sm rounded hover:bg-accent"
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FieldError errors={field.state.meta.errors} />
                  </div>
                );
              }}
            </form.Field>

            {/* Attachment Style */}
            <form.Field name="attachmentStyle">
              {(field) => {
                const getAttachmentStyleLabel = (value?: string): string => {
                  if (!value) return "";
                  const option = attachmentStyles.find((opt) => opt.value === value);
                  return option?.label || value;
                };

                if (field.state.value) {
                  return (
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border-l-4 border-purple-400">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                          <Settings className="text-[18px]" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">
                            Attachment Style
                          </span>
                        </div>
                      </div>
                      <h4 className="text-sm font-bold mb-1">
                        {getAttachmentStyleLabel(field.state.value)}
                      </h4>
                      <FieldError errors={field.state.meta.errors} />
                    </div>
                  );
                }

                return (
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-3">Attachment Style</p>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          disabled={isLoading}
                          className="w-full flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="text-sm font-medium">Select...</span>
                          <ChevronDown className="text-slate-400" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-2">
                        <div className="flex flex-col gap-1">
                          {attachmentStyles.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                field.handleChange(option.value);
                                field.handleBlur();
                              }}
                              className="text-left px-2 py-1.5 text-sm rounded hover:bg-accent"
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FieldError errors={field.state.meta.errors} />
                  </div>
                );
              }}
            </form.Field>

            {/* Deal-Breakers */}
            <form.Field name="dealBreakers">
              {(field) => {
                const getDealBreakerLabel = (value: string): string => {
                  const option = DEAL_BREAKER_OPTIONS.find((opt) => opt.value === value);
                  return option?.label || value;
                };

                const handleRemoveDealBreaker = (dealBreaker: string) => {
                  const updated = field.state.value.filter((db) => db !== dealBreaker);
                  field.handleChange(updated);
                  field.handleBlur();
                };

                const handleAddDealBreaker = (dealBreaker: string) => {
                  if (!field.state.value.includes(dealBreaker)) {
                    field.handleChange([...field.state.value, dealBreaker]);
                    field.handleBlur();
                  }
                  setDealBreakerPopoverOpen(false);
                };

                const availableDealBreakers = DEAL_BREAKER_OPTIONS.filter(
                  (db) => !field.state.value.includes(db.value)
                );

                return (
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-3">Deal-Breakers</p>
                    <div className="flex gap-2 flex-wrap">
                      {field.state.value.map((dealBreaker) => (
                        <span
                          key={dealBreaker}
                          className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-800 px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-2"
                        >
                          {getDealBreakerLabel(dealBreaker)}
                          {!isLoading && (
                            <button
                              type="button"
                              onClick={() => handleRemoveDealBreaker(dealBreaker)}
                              className="hover:text-rose-700 dark:hover:text-rose-300"
                              aria-label={`Remove ${getDealBreakerLabel(dealBreaker)}`}
                            >
                              ×
                            </button>
                          )}
                        </span>
                      ))}
                      {!isLoading && availableDealBreakers.length > 0 && (
                        <Popover
                          open={dealBreakerPopoverOpen}
                          onOpenChange={setDealBreakerPopoverOpen}
                        >
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                              <Plus className="size-4" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-64 p-2">
                            <div className="flex flex-col gap-1">
                              {availableDealBreakers.map((dealBreaker) => (
                                <button
                                  key={dealBreaker.value}
                                  type="button"
                                  onClick={() => handleAddDealBreaker(dealBreaker.value)}
                                  className="text-left px-2 py-1.5 text-sm rounded hover:bg-accent"
                                >
                                  {dealBreaker.label}
                                </button>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                    <FieldError errors={field.state.meta.errors} />
                  </div>
                );
              }}
            </form.Field>
          </div>
        </section>

        {/* Lifestyle Snapshot */}
        <section className="space-y-4 pb-8">
          <div className="flex items-center gap-2 px-2">
            <Coffee className="text-primary text-xl" />
            <h3 className="font-display text-xl font-bold">Lifestyle Snapshot</h3>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm space-y-8">
            {/* Work Rhythm */}
            <form.Field name="workSchedule">
              {(field) => {
                const currentWorkRhythm = field.state.value || "";
                return (
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-3">Work Rhythm</p>
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
                      {WORK_RHYTHM_OPTIONS.map((option) => {
                        const isSelected = currentWorkRhythm === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              field.handleChange(option.value);
                              field.handleBlur();
                            }}
                            disabled={isLoading}
                            className={cn(
                              "flex-1 py-3 text-xs font-semibold rounded-xl transition-all duration-150 ease-out",
                              isSelected
                                ? "bg-primary text-white shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300",
                              isLoading && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            {option.label}
                            {isSelected && option.value === "flexible_remote" && (
                              <Sparkles size={14} className="fill-current" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <FieldError errors={field.state.meta.errors} />
                  </div>
                );
              }}
            </form.Field>

            {/* Date Budget Tendency */}
            <form.Field name="dateBudget">
              {(field) => {
                const currentDateBudgetPosition = convertDateBudgetToPosition(field.state.value);
                const dateBudgetPosition = DATE_BUDGET_TO_VALUE[currentDateBudgetPosition] ?? 50;
                const dateBudgetLabel = DATE_BUDGET_LABELS[dateBudgetPosition]?.label || "$$ (Balanced)";

                return (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-xs font-bold text-slate-400 uppercase">Date Budget Tendency</p>
                      <span className="text-[11px] font-bold text-primary">
                        {dateBudgetLabel}
                      </span>
                    </div>
                    <div className="relative pt-1">
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full w-full">
                        <div
                          className="absolute left-0 top-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full transition-all duration-200 ease-out"
                          style={{ width: `${dateBudgetPosition}%` }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            // Cycle through positions: low -> balanced -> high -> low
                            const nextPosition =
                              currentDateBudgetPosition === "low"
                                ? "balanced"
                                : currentDateBudgetPosition === "balanced"
                                  ? "high"
                                  : "low";
                            const newValue = convertDateBudgetPositionToValue(nextPosition);
                            field.handleChange(newValue);
                            field.handleBlur();
                          }}
                          disabled={isLoading}
                          className={cn(
                            "absolute w-6 h-6 bg-primary rounded-full border-4 border-white dark:border-slate-900 shadow-md -ml-3 transition-all duration-200 ease-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                            isLoading && "opacity-50 cursor-not-allowed"
                          )}
                          style={{
                            left: `${dateBudgetPosition}%`,
                            top: "-2px",
                          }}
                          aria-label={`Date budget: ${dateBudgetLabel}`}
                        />
                      </div>
                    </div>
                    <FieldError errors={field.state.meta.errors} />
                  </div>
                );
              }}
            </form.Field>

            {/* Social Energy Battery */}
            <form.Field name="socialEnergy">
              {(field) => {
                const currentSocialEnergy = field.state.value || "";
                return (
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-3">Social Energy Battery</p>
                    <div className="grid grid-cols-3 gap-2">
                      {socialEnergyLevels.map((option) => {
                        const isSelected = currentSocialEnergy === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              field.handleChange(option.value);
                              field.handleBlur();
                            }}
                            disabled={isLoading}
                            className={cn(
                              "p-3 text-center rounded-2xl text-[11px] transition-all duration-150 ease-out",
                              isSelected
                                ? "bg-white dark:bg-slate-800 ring-2 ring-primary/40 font-bold text-primary flex items-center justify-center gap-1 shadow-sm"
                                : "border border-slate-100 dark:border-slate-800 text-slate-400 hover:border-primary/30",
                              isLoading && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            {option.label}
                            {isSelected && option.value === "balanced" && (
                              <Zap size={14} className="text-[14px]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <FieldError errors={field.state.meta.errors} />
                  </div>
                );
              }}
            </form.Field>
          </div>
        </section>

        {/* Social Signals */}
        {/* <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Share2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold">Social Signals</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Connect your social presence
                </p>
              </div>
            </div>
          </CardHeader> */}
        {/* <CardContent className="space-y-5"> */}
        {/* Instagram */}
        {/* <form.Field name="instagramUrl">
              {(field) => {
                const hasUrl =
                  field.state.value && field.state.value.trim() !== "";

                return (
                  <Field className="flex flex-col gap-2">
                    <div className="flex items-center justify-between mb-1">
                      <FieldLabel className="flex items-center gap-2">
                        <InstagramIcon className="h-5 w-5 shrink-0" />
                        Instagram
                      </FieldLabel>
                      {hasUrl && (
                        <span className="text-sm text-green-600 dark:text-green-400">
                          ✓ Linked
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        name="instagramUrl"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="https://instagram.com/username"
                        disabled={isLoading}
                        className="flex-1"
                      />
                      {hasUrl && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => field.handleChange("")}
                          disabled={isLoading}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                );
              }}
            </form.Field> */}
        {/* </CardContent> */}
        {/* </Card> */}
      </div>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Discard changes?</DialogTitle>
            <DialogDescription>
              All unsaved changes will be lost. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReset}>
              Discard Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sticky Save and Reset Buttons */}
      {/* <ProfileSaveButton
        hasChanges={hasChanges}
        isValid={isValid}
        isLoading={Boolean(isLoading)}
        isSuccess={isSuccess}
        onSave={handleFormSubmit}
        onReset={handleResetClick}
      /> */}
    </form>
  );
}
