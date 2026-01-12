"use client";

import { useState, useEffect } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/commons/radio-group";
import { Select } from "@/components/commons/select";
import { Combobox } from "@/components/ui/combobox";
import {
  defaultPartnerFormValues,
  partnerGenders,
  partnerAgeRanges,
  goalForRelationshipOptions,
  years,
  months,
  days,
  hours,
  minutes,
  periods,
  VIETNAM_CITIES,
} from "./const";
import { TPartnerFormProps, PartnerGender, PartnerAgeRange } from "./types";
import type { GoalType } from "@/features/profile/partner/types";
import { partnerFormSchema } from "./validate-schema";

export default function PartnerForm(props: Readonly<TPartnerFormProps>) {
  const { onSubmit, isLoading, onStepChange } = props;
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Notify parent of step changes
  useEffect(() => {
    onStepChange?.(currentStep);
  }, [currentStep, onStepChange]);

  const form = useForm({
    defaultValues: defaultPartnerFormValues,
    validators: {
      // @tanstack/react-form supports Zod schema directly but types are not fully compatible
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange: partnerFormSchema as unknown as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onBlur: partnerFormSchema as unknown as any,
    },
  });

  const canSubmit = useStore(form.store, (state) => state.canSubmit);
  const values = useStore(form.store, (state) => state.values);

  // Auto-focus first field on step change
  useEffect(() => {
    const firstInput = document.querySelector(
      `[data-step="${currentStep}"] input, [data-step="${currentStep}"] textarea, [data-step="${currentStep}"] select`
    ) as HTMLElement;
    if (firstInput && !isLoading) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }, [currentStep, isLoading]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      if (validateCurrentStep()) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      return (
        values.partnerName.trim() !== "" &&
        values.birthYear !== "" &&
        values.birthMonth !== "" &&
        values.birthDay !== "" &&
        values.partnerGender !== "" &&
        (!values.birthTimeKnown ||
          (values.birthHour !== "" && values.birthMinute !== ""))
      );
    }
    if (step === 2) {
      return values.situationDescription.trim().length >= 10;
    }
    if (step === 3) {
      return (
        values.keyQuestion.trim().length >= 5 &&
        values.goalForRelationship !== ""
      );
    }
    // Step 4 is optional
    return true;
  };

  const validateCurrentStep = (): boolean => {
    return validateStep(currentStep);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Always prevent default form submission
    // Form should only submit via explicit button click
    e.preventDefault();
  };

  const handleSubmitButtonClick = () => {
    // Only allow submission on the last step when form is valid
    if (currentStep === totalSteps && canSubmit && !isLoading) {
      const value = form.state.values;
      onSubmit?.(value);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col gap-6" data-step="1">
            {/* Partner's Name */}
            <form.Field name="partnerName">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel htmlFor={field.name}>
                    Name <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      field.handleBlur();
                    }}
                    disabled={isLoading}
                    placeholder="Enter partner's name"
                    autoComplete="name"
                  />
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </Field>
              )}
            </form.Field>

            {/* Date of Birth */}
            <div className="flex flex-col gap-2">
              <FieldLabel>
                Date of Birth <span className="text-destructive">*</span>
              </FieldLabel>
              <div className="flex gap-2">
                <form.Field name="birthYear">
                  {(field) => (
                    <Field className="flex-1">
                      <Select
                        value={field.state.value}
                        onValueChange={(value) => {
                          field.handleChange(value);
                          field.handleBlur();
                        }}
                        options={years}
                        placeholder="Year"
                        disabled={isLoading}
                      />
                      <FieldError
                        errors={
                          field.state.meta.isTouched
                            ? field.state.meta.errors
                            : undefined
                        }
                      />
                    </Field>
                  )}
                </form.Field>
                <form.Field name="birthMonth">
                  {(field) => (
                    <Field className="flex-1">
                      <Select
                        value={field.state.value}
                        onValueChange={(value) => {
                          field.handleChange(value);
                          field.handleBlur();
                        }}
                        options={months}
                        placeholder="Month"
                        disabled={isLoading}
                      />
                      <FieldError
                        errors={
                          field.state.meta.isTouched
                            ? field.state.meta.errors
                            : undefined
                        }
                      />
                    </Field>
                  )}
                </form.Field>
                <form.Field name="birthDay">
                  {(field) => (
                    <Field className="flex-1">
                      <Select
                        value={field.state.value}
                        onValueChange={(value) => {
                          field.handleChange(value);
                          field.handleBlur();
                        }}
                        options={days}
                        placeholder="Day"
                        disabled={isLoading}
                      />
                      <FieldError
                        errors={
                          field.state.meta.isTouched
                            ? field.state.meta.errors
                            : undefined
                        }
                      />
                    </Field>
                  )}
                </form.Field>
              </div>
            </div>

            {/* Time of Birth */}
            <form.Field name="birthTimeKnown">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel className="text-muted-foreground">
                    Time of Birth
                  </FieldLabel>
                  <div className=" rounded-md p-px">
                    <RadioGroup
                      value={field.state.value ? "known" : "unknown"}
                      onValueChange={(value) => {
                        field.handleChange(value === "known");
                        field.handleBlur();
                      }}
                      disabled={isLoading}
                      className="flex gap-2"
                    >
                      <RadioGroupItem value="unknown">Unknown</RadioGroupItem>
                      <RadioGroupItem value="known">Enter</RadioGroupItem>
                    </RadioGroup>
                  </div>
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </Field>
              )}
            </form.Field>
            {values.birthTimeKnown && (
              <div className="flex gap-2">
                <form.Field name="birthHour">
                  {(field) => (
                    <Field className="flex-1">
                      <Select
                        value={field.state.value}
                        onValueChange={(value) => {
                          field.handleChange(value);
                          field.handleBlur();
                        }}
                        options={hours}
                        placeholder="Hour"
                        disabled={isLoading}
                      />
                      <FieldError
                        errors={
                          field.state.meta.isTouched
                            ? field.state.meta.errors
                            : undefined
                        }
                      />
                    </Field>
                  )}
                </form.Field>
                <form.Field name="birthMinute">
                  {(field) => (
                    <Field className="flex-1">
                      <Select
                        value={field.state.value}
                        onValueChange={(value) => {
                          field.handleChange(value);
                          field.handleBlur();
                        }}
                        options={minutes}
                        placeholder="Minute"
                        disabled={isLoading}
                      />
                      <FieldError
                        errors={
                          field.state.meta.isTouched
                            ? field.state.meta.errors
                            : undefined
                        }
                      />
                    </Field>
                  )}
                </form.Field>
                <form.Field name="birthPeriod">
                  {(field) => (
                    <Field className="flex-1">
                      <Select
                        value={field.state.value}
                        onValueChange={(value) => {
                          field.handleChange(value as "AM" | "PM");
                          field.handleBlur();
                        }}
                        options={periods}
                        placeholder="AM/PM"
                        disabled={isLoading}
                      />
                      <FieldError
                        errors={
                          field.state.meta.isTouched
                            ? field.state.meta.errors
                            : undefined
                        }
                      />
                    </Field>
                  )}
                </form.Field>
              </div>
            )}

            {/* Partner's Gender */}
            <form.Field name="partnerGender">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel>
                    Gender <span className="text-destructive">*</span>
                  </FieldLabel>
                  <div className=" rounded-md p-1">
                    <RadioGroup
                      value={field.state.value}
                      onValueChange={(value) => {
                        field.handleChange(value as PartnerGender);
                        field.handleBlur();
                      }}
                      disabled={isLoading}
                      className="flex gap-2 flex-wrap"
                    >
                      {partnerGenders.map((gender) => (
                        <RadioGroupItem key={gender.value} value={gender.value}>
                          {gender.label}
                        </RadioGroupItem>
                      ))}
                    </RadioGroup>
                  </div>
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </Field>
              )}
            </form.Field>

            {/* Partner's Age Range */}
            <form.Field name="partnerAgeRange">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel className="text-muted-foreground">
                    Age Range
                  </FieldLabel>
                  <div className="rounded-md p-1">
                    <RadioGroup
                      value={field.state.value}
                      onValueChange={(value) => {
                        field.handleChange(value as PartnerAgeRange);
                        field.handleBlur();
                      }}
                      disabled={isLoading}
                      className="flex gap-2 flex-wrap"
                    >
                      {partnerAgeRanges.map((ageRange) => (
                        <RadioGroupItem
                          key={ageRange.value}
                          value={ageRange.value}
                        >
                          {ageRange.label}
                        </RadioGroupItem>
                      ))}
                    </RadioGroup>
                  </div>
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </Field>
              )}
            </form.Field>

            {/* Country of Birth */}
            <form.Field name="country">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel className="text-muted-foreground">
                    Country of Birth
                  </FieldLabel>
                  <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
                    Việt Nam
                  </div>
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </Field>
              )}
            </form.Field>

            {/* City of Birth */}
            <form.Field name="city">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel className="text-muted-foreground">
                    City of Birth
                  </FieldLabel>
                  <Combobox
                    value={field.state.value}
                    onValueChange={(value) => {
                      field.handleChange(value);
                      field.handleBlur();
                    }}
                    options={VIETNAM_CITIES}
                    placeholder="Search and select a city"
                    searchPlaceholder="Search cities..."
                    disabled={isLoading}
                    allowClear
                    searchMode="client"
                  />
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </Field>
              )}
            </form.Field>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col gap-6" data-step="2">
            <form.Field name="situationDescription">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel htmlFor={field.name}>
                    Current Situation{" "}
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      field.handleBlur();
                    }}
                    disabled={isLoading}
                    placeholder="The more detailed you write, the more accurate the analysis will be."
                    className="min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-y"
                  />
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </Field>
              )}
            </form.Field>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col gap-6" data-step="3">
            {/* Key Question */}
            <form.Field name="keyQuestion">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel htmlFor={field.name}>
                    Key Question (One Line Summary){" "}
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      field.handleBlur();
                    }}
                    disabled={isLoading}
                    placeholder="e.g., Can I get back together with this person?"
                  />
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </Field>
              )}
            </form.Field>

            {/* Goal for Relationship */}
            <form.Field name="goalForRelationship">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel>
                    Relationship Goal{" "}
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <div className=" rounded-md p-1">
                    <RadioGroup
                      value={field.state.value}
                      onValueChange={(value) => {
                        field.handleChange(value as GoalType);
                        field.handleBlur();
                      }}
                      disabled={isLoading}
                      className="flex gap-2 flex-wrap"
                    >
                      {goalForRelationshipOptions.map((goal) => (
                        <RadioGroupItem key={goal.value} value={goal.value}>
                          {goal.label}
                        </RadioGroupItem>
                      ))}
                    </RadioGroup>
                  </div>
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </Field>
              )}
            </form.Field>
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col gap-6" data-step="4">
            {/* Partner's Personality */}
            <form.Field name="partnerPersonality">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-muted-foreground"
                  >
                    Personality
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      field.handleBlur();
                    }}
                    disabled={isLoading}
                    placeholder="e.g., Kind but stubborn, sensitive about contact issues."
                  />
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </Field>
              )}
            </form.Field>

            {/* Summary of Major Past Events */}
            <form.Field name="majorPastEvents">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-muted-foreground"
                  >
                    Major Past Events
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      field.handleBlur();
                    }}
                    disabled={isLoading}
                    placeholder="e.g., Had a big fight a month ago, my partner recently expressed disappointment."
                  />
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </Field>
              )}
            </form.Field>

            {/* My Current Feelings */}
            <form.Field name="currentFeelings">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-muted-foreground"
                  >
                    Current Feelings
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      field.handleBlur();
                    }}
                    disabled={isLoading}
                    placeholder="e.g., Very anxious and confused, I still like them a lot."
                  />
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </Field>
              )}
            </form.Field>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form className="flex size-full flex-col gap-6" onSubmit={handleFormSubmit}>
      {/* Content Card */}
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="transition-opacity duration-150 ease-out motion-reduce:transition-none">
            {renderStepContent()}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="sticky bottom-16 z-40 bg-background/95 backdrop-blur-sm border-t px-4 py-4">
        <div className="flex gap-2">
          {currentStep > 1 ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handlePrev}
                disabled={isLoading}
                className="flex-1"
              >
                Previous
              </Button>
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isLoading || !validateCurrentStep()}
                  className="flex-1"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmitButtonClick}
                  disabled={!canSubmit || isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Processing..." : "Create Profile"}
                </Button>
              )}
            </>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              disabled={isLoading || !validateCurrentStep()}
              className="flex-1 w-full"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
