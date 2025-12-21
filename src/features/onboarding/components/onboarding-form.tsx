'use client';

import { useState } from 'react';
import { useForm, useStore } from '@tanstack/react-form';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Select } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/commons/radio-group';
import {
  defaultOnboardingFormValues,
  years,
  months,
  days,
  hours,
  minutes,
  periods,
  genders,
} from '../const';
import { COUNTRY_LIST } from '@/constants/data';
import { onboardingFormSchema } from '../validate-schema';
import { TOnboardingFormProps } from '../types';

export default function OnboardingForm(props: Readonly<TOnboardingFormProps>) {
  const { onSubmit, isLoading } = props;
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const form = useForm({
    defaultValues: defaultOnboardingFormValues,
    validators: {
      // @tanstack/react-form supports Zod schema directly but types are not fully compatible
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onBlur: onboardingFormSchema as unknown as any,
    },
  });

  const canSubmit = useStore(form.store, (state) => state.canSubmit);
  const values = useStore(form.store, (state) => state.values);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      // Validate current step before proceeding
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
      return values.name.trim() !== '';
    }
    if (currentStep === 2) {
      const dateValid =
        values.birthYear &&
        values.birthMonth &&
        values.birthDay &&
        values.genderAtBirth;

      // If time is known, validate time fields; otherwise, only date is required
      if (values.birthTimeKnown) {
        return (
          dateValid &&
          values.birthHour &&
          values.birthMinute &&
          values.birthPeriod
        );
      }
      return dateValid;
    }
    if (currentStep === 3) {
      return values.country.trim() !== '' && values.city.trim() !== '';
    }
    return true;
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
          <form.Field name="name">
            {(field) => (
              <Field className="flex flex-col gap-2">
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  id={field.name}
                  autoComplete="name"
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter your name"
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>
        );

      case 2:
        return (
          <div className="flex flex-col gap-6">
            {/* Date of Birth */}
            <div className="flex flex-col gap-2">
              <FieldLabel>Date of Birth (8 digits)</FieldLabel>
              <div className="flex gap-2">
                <form.Field name="birthYear">
                  {(field) => (
                    <Field className="flex-1">
                      <Select
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
                        options={years}
                        placeholder="Year"
                        disabled={isLoading}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </form.Field>
                <form.Field name="birthMonth">
                  {(field) => (
                    <Field className="flex-1">
                      <Select
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
                        options={months}
                        placeholder="Month"
                        disabled={isLoading}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </form.Field>
                <form.Field name="birthDay">
                  {(field) => (
                    <Field className="flex-1">
                      <Select
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
                        options={days}
                        placeholder="Day"
                        disabled={isLoading}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </form.Field>
              </div>
            </div>

            {/* Time of Birth */}
            <form.Field name="birthTimeKnown">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel>Time of Birth</FieldLabel>
                  <div className="bg-gray-100 rounded-md p-px">
                    <RadioGroup
                      value={field.state.value ? 'known' : 'unknown'}
                      onValueChange={(value) =>
                        field.handleChange(value === 'known')
                      }
                      disabled={isLoading}
                      className="flex gap-2"
                    >
                      <RadioGroupItem value="unknown">Unknown</RadioGroupItem>
                      <RadioGroupItem value="known">Enter</RadioGroupItem>
                    </RadioGroup>
                  </div>
                  <FieldError errors={field.state.meta.errors} />
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
                        onValueChange={(value) => field.handleChange(value)}
                        options={hours}
                        placeholder="Hour"
                        disabled={isLoading}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </form.Field>
                <form.Field name="birthMinute">
                  {(field) => (
                    <Field className="flex-1">
                      <Select
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
                        options={minutes}
                        placeholder="Minute"
                        disabled={isLoading}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </form.Field>
                <form.Field name="birthPeriod">
                  {(field) => (
                    <Field className="flex-1">
                      <Select
                        value={field.state.value}
                        onValueChange={(value) =>
                          field.handleChange(value as 'AM' | 'PM')
                        }
                        options={periods}
                        placeholder="AM/PM"
                        disabled={isLoading}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </form.Field>
              </div>
            )}

            {/* Gender at Birth */}
            <form.Field name="genderAtBirth">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel>Gender at Birth</FieldLabel>
                  <div className="bg-gray-100 rounded-md p-px">
                    <RadioGroup
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as 'Male' | 'Female')
                      }
                      disabled={isLoading}
                      className="flex gap-2"
                    >
                      {genders.map((gender) => (
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
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col gap-6">
            <form.Field name="country">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel htmlFor={field.name}>Country of Birth</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                    options={COUNTRY_LIST.map((country) => ({
                      value: country.name,
                      label: country.name,
                    }))}
                    placeholder="Select a country"
                    disabled={isLoading}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
            <form.Field name="city">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel htmlFor={field.name}>City of Birth</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={isLoading || !values.country}
                    placeholder={
                      values.country
                        ? 'Enter city name'
                        : 'Select a country first'
                    }
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

  return (
    <form className="flex size-full flex-col gap-6" onSubmit={handleFormSubmit}>
      {/* Header */}
      <div className="flex items-center gap-4">
        {currentStep > 1 && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handlePrev}
            disabled={isLoading}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <h1 className="flex-1 text-center text-xl font-semibold">
          Create My Profile
        </h1>
        {currentStep > 1 && <div className="w-9" />}
      </div>

      {/* Content Card */}
      <div className="flex-1 rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Enter Information</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Please enter your information for an accurate chart analysis.
          </p>
        </div>
        <div>{renderStepContent()}</div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-2">
        {currentStep > 1 && (
          <Button
            type="button"
            variant="outline"
            onClick={handlePrev}
            disabled={isLoading}
            className="flex-1"
          >
            Prev
          </Button>
        )}
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
            {isLoading ? 'Processing...' : 'Start Analyzing'}
          </Button>
        )}
      </div>
    </form>
  );
}
