'use client';

import { useState } from 'react';
import { useForm, useStore } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/commons/radio-group';
import MobileHeader from '@/components/commons/mobile-header/mobile-header';
import {
  defaultPartnerFormValues,
  partnerGenders,
  partnerAgeRanges,
  ultimateGoals,
} from './const';
import {
  TPartnerFormProps,
  PartnerGender,
  PartnerAgeRange,
  UltimateGoal,
} from './types';
import { partnerFormSchema } from './validate-schema';

export default function PartnerForm(props: Readonly<TPartnerFormProps>) {
  const { onSubmit, isLoading } = props;
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const form = useForm({
    defaultValues: defaultPartnerFormValues,
    validators: {
      // @tanstack/react-form supports Zod schema directly but types are not fully compatible
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onBlur: partnerFormSchema as unknown as any,
    },
  });

  const canSubmit = useStore(form.store, (state) => state.canSubmit);
  const values = useStore(form.store, (state) => state.values);

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

  const validateCurrentStep = () => {
    if (currentStep === 1) {
      return values.partnerGender !== '' && values.partnerAgeRange !== '';
    }
    if (currentStep === 2) {
      return values.situationDescription.trim() !== '';
    }
    if (currentStep === 3) {
      return values.keyQuestion.trim() !== '' && values.ultimateGoal !== '';
    }
    // Step 4 is optional, so always return true
    return (
      values.partnerPersonality.trim() !== '' &&
      values.majorPastEvents.trim() !== '' &&
      values.currentFeelings.trim() !== ''
    );
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = form.state.values;
    onSubmit?.(value);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col gap-6">
            {/* Partner's Name */}
            <form.Field name="partnerName">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel htmlFor={field.name}>Partner Name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={isLoading}
                    placeholder="Partner name"
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
            {/* Partner's Gender */}
            <form.Field name="partnerGender">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel>Partner&apos;s Gender</FieldLabel>
                  <div className="bg-gray-100 rounded-md p-1">
                    <RadioGroup
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as PartnerGender)
                      }
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
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            {/* Partner's Age Range */}
            <form.Field name="partnerAgeRange">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel>Partner&apos;s Age Range</FieldLabel>
                  <div className="bg-gray-100 rounded-md p-1">
                    <RadioGroup
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as PartnerAgeRange)
                      }
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
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
          </div>
        );

      case 2:
        return (
          <form.Field name="situationDescription">
            {(field) => (
              <Field className="flex flex-col gap-2">
                <FieldLabel htmlFor={field.name}>
                  Situation Description
                </FieldLabel>
                <p className="text-sm text-muted-foreground mb-2">
                  Feel free to write about your relationship, current situation,
                  concerns, etc.
                </p>
                <textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isLoading}
                  placeholder="The more detailed you write, the more accurate the analysis will be."
                  className="min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-y"
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>
        );

      case 3:
        return (
          <div className="flex flex-col gap-6">
            {/* Key Question */}
            <form.Field name="keyQuestion">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel htmlFor={field.name}>
                    Key Question (one-line summary)
                  </FieldLabel>
                  <p className="text-sm text-muted-foreground mb-2">
                    Please select what you&apos;re most curious about and your
                    ultimate goal.
                  </p>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={isLoading}
                    placeholder="Summarize what you're most curious about. (e.g., Can I get back together with this person?)"
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            {/* What You Ultimately Want */}
            <form.Field name="ultimateGoal">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel>What You Ultimately Want</FieldLabel>
                  <div className="bg-gray-100 rounded-md p-1">
                    <RadioGroup
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as UltimateGoal)
                      }
                      disabled={isLoading}
                      className="flex gap-2 flex-wrap"
                    >
                      {ultimateGoals.map((goal) => (
                        <RadioGroupItem key={goal.value} value={goal.value}>
                          {goal.label}
                        </RadioGroupItem>
                      ))}
                    </RadioGroup>
                  </div>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col gap-6">
            <p className="text-sm text-muted-foreground mb-2">
              Providing more details will deepen the analysis.
            </p>

            {/* Partner's Personality */}
            <form.Field name="partnerPersonality">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel htmlFor={field.name}>
                    Partner&apos;s Personality
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={isLoading}
                    placeholder="e.g., Kind but stubborn, sensitive about contact issues."
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            {/* Summary of Major Past Events */}
            <form.Field name="majorPastEvents">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel htmlFor={field.name}>
                    Summary of Major Past Events
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={isLoading}
                    placeholder="e.g., Had a big fight a month ago, my partner recently expressed disappointment."
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            {/* My Current Feelings */}
            <form.Field name="currentFeelings">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel htmlFor={field.name}>
                    My Current Feelings
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={isLoading}
                    placeholder="e.g., Very anxious and confused, I still like them a lot."
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Partner's Information";
      case 2:
        return 'Describe the current situation in detail';
      case 3:
        return 'What do you want?';
      case 4:
        return 'Enter additional information (Optional)';
      default:
        return '';
    }
  };

  return (
    <form className="flex size-full flex-col gap-6" onSubmit={handleFormSubmit}>
      {/* Header */}
      <MobileHeader title="Strategy for a successful crush" />

      {/* Content Card */}
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">{getStepTitle()}</h2>
            {currentStep === 2 && (
              <p className="text-sm text-muted-foreground mt-1">
                Feel free to write about your relationship, current situation,
                concerns, etc.
              </p>
            )}
            {currentStep === 3 && (
              <p className="text-sm text-muted-foreground mt-1">
                Please select what you&apos;re most curious about and your
                ultimate goal.
              </p>
            )}
            {currentStep === 4 && (
              <p className="text-sm text-muted-foreground mt-1">
                Providing more details will deepen the analysis.
              </p>
            )}
          </div>
          <div>{renderStepContent()}</div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="px-4 pb-4">
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
                Prev
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
                  type="submit"
                  disabled={!canSubmit || isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Processing...' : 'Start'}
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
