"use client";

import { useEffect, useRef, useState, useMemo, useId } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import ReactTagsInput from "react-tagsinput";
import { BrainCog, Coffee, Share2, CheckCircle } from "lucide-react";
import { siInstagram } from "simple-icons";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Select } from "@/components/commons/select";
import { RadioGroup, RadioGroupItem } from "@/components/commons/radio-group";
import {
  CheckboxGroup,
  CheckboxGroupItem,
} from "@/components/commons/checkbox-group";
import {
  defaultProfileFormValues,
  loveLanguages,
  attachmentStyles,
  communicationStyles,
  workSchedules,
  socialEnergyLevels,
} from "../const";
import { profileFormSchema } from "../validate-schema";
import { TProfileFormProps, TProfileFormData } from "../types";
import ProfileSaveButton from "./profile-save-button";

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

export default function ProfileForm(props: Readonly<TProfileFormProps>) {
  const { onSubmit, isLoading, isSuccess, defaultValues } = props;
  const previousValuesRef = useRef<string | undefined>(undefined);
  const [showResetDialog, setShowResetDialog] = useState(false);

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
      {isSuccess && (
        <Alert className="mb-6 border-green-500/50 bg-green-50/50 dark:bg-green-950/10 animate-in fade-in-0 duration-200">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-700 dark:text-green-300">
            Profile saved successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Form Content */}
      <div className="space-y-6">
        {/* Personality & Preference */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <BrainCog className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold">
                  Personality & Preference
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  How you connect and communicate
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <form.Field name="primaryLoveLanguage">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel>Primary Love Language</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => {
                      field.handleChange(value);
                      field.handleBlur();
                    }}
                    options={loveLanguages}
                    placeholder="Select your primary love language"
                    disabled={isLoading}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            <form.Field name="communicationStyles">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel>Communication Style</FieldLabel>
                  {field.state.value.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Select one or more communication styles
                    </p>
                  )}
                  <CheckboxGroup
                    value={field.state.value}
                    onValueChange={(value) => {
                      field.handleChange(value);
                      field.handleBlur();
                    }}
                    disabled={isLoading}
                  >
                    {communicationStyles.map((style) => (
                      <CheckboxGroupItem key={style.value} value={style.value}>
                        {style.label}
                      </CheckboxGroupItem>
                    ))}
                  </CheckboxGroup>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            <form.Field name="attachmentStyle">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel>Attachment Style</FieldLabel>
                  <p className="text-sm text-muted-foreground">
                    How you typically form emotional bonds
                  </p>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => {
                      field.handleChange(value);
                      field.handleBlur();
                    }}
                    options={attachmentStyles}
                    placeholder="Select your attachment style"
                    disabled={isLoading}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            <form.Field name="dealBreakers">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel>Deal-breakers</FieldLabel>
                  <div className="react-tagsinput-wrapper">
                    <ReactTagsInput
                      value={field.state.value}
                      onChange={(tags) => {
                        field.handleChange(tags);
                        field.handleBlur();
                      }}
                      disabled={isLoading}
                      inputProps={{
                        placeholder: "Add a deal-breaker (e.g., Smoking)",
                        className: "react-tagsinput-input",
                        onBlur: () => field.handleBlur(),
                      }}
                      tagProps={{
                        className:
                          "react-tagsinput-tag bg-primary text-primary-foreground",
                        classNameRemove: "react-tagsinput-remove",
                      }}
                    />
                  </div>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
          </CardContent>
        </Card>

        {/* Lifestyle Snapshot */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Coffee className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold">Lifestyle Snapshot</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Your daily rhythms and preferences
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <form.Field name="workSchedule">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel>Work Schedule</FieldLabel>
                  <RadioGroup
                    value={field.state.value}
                    onValueChange={(value) => {
                      field.handleChange(value);
                    }}
                    disabled={isLoading}
                    className="flex gap-2"
                  >
                    {workSchedules.map((schedule) => (
                      <RadioGroupItem
                        key={schedule.value}
                        value={schedule.value}
                      >
                        {schedule.label}
                      </RadioGroupItem>
                    ))}
                  </RadioGroup>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            <form.Field name="dateBudget">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel>Date Budget</FieldLabel>
                  <p className="text-sm text-muted-foreground">
                    Typical amount you're comfortable spending per date
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Low</span>
                      <span className="text-base font-semibold">
                        ${field.state.value}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        High
                      </span>
                    </div>
                    <Slider
                      min={10}
                      max={1000}
                      step={10}
                      value={[field.state.value]}
                      onValueChange={(values) => {
                        field.handleChange(values[0]);
                      }}
                      disabled={isLoading}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground/80">
                      <span>Budget-friendly: $20-50</span>
                      <span>Moderate: $50-150</span>
                      <span>Premium: $150+</span>
                    </div>
                  </div>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            <form.Field name="socialEnergy">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel>Social Energy Battery</FieldLabel>
                  <p className="text-sm text-muted-foreground">
                    Your preference for social interaction frequency
                  </p>
                  <RadioGroup
                    value={field.state.value}
                    onValueChange={(value) => {
                      field.handleChange(value);
                    }}
                    disabled={isLoading}
                    className="flex gap-2"
                  >
                    {socialEnergyLevels.map((level) => (
                      <RadioGroupItem key={level.value} value={level.value}>
                        {level.label}
                      </RadioGroupItem>
                    ))}
                  </RadioGroup>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            <form.Field name="hobbies">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel>Hobbies & Interests</FieldLabel>
                  <div className="react-tagsinput-wrapper">
                    <ReactTagsInput
                      value={field.state.value}
                      onChange={(tags) => {
                        field.handleChange(tags);
                        field.handleBlur();
                      }}
                      disabled={isLoading}
                      inputProps={{
                        placeholder: "Gym, Coffee hopping, Traveling”,...",
                        className: "react-tagsinput-input",
                        onBlur: () => field.handleBlur(),
                      }}
                      tagProps={{
                        className:
                          "react-tagsinput-tag bg-primary text-primary-foreground",
                        classNameRemove: "react-tagsinput-remove",
                      }}
                    />
                  </div>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
          </CardContent>
        </Card>

        {/* Social Signals */}
        <Card>
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
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Instagram */}
            <form.Field name="instagramUrl">
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
            </form.Field>
          </CardContent>
        </Card>
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
      <ProfileSaveButton
        hasChanges={hasChanges}
        isValid={isValid}
        isLoading={Boolean(isLoading)}
        isSuccess={isSuccess}
        onSave={handleFormSubmit}
        onReset={handleResetClick}
      />
    </form>
  );
}
