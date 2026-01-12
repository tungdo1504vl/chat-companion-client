"use client";

import { useState, useEffect } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Select } from "@/components/commons/select";
import { Combobox } from "@/components/ui/combobox";
import { RadioGroup, RadioGroupItem } from "@/components/commons/radio-group";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DateOfBirthPicker } from "./date-of-birth-picker";
import {
  defaultOnboardingFormValues,
  hours,
  minutes,
  periods,
  genders,
  VIETNAM_CITIES,
} from "../const";
import { onboardingFormSchema } from "../validate-schema";
import { TOnboardingFormProps } from "../types";

interface CityFieldStepProps {
  readonly isLoading: boolean;
  readonly dirtyFields: Set<string>;
  readonly setDirtyFields: React.Dispatch<React.SetStateAction<Set<string>>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly form: any; // tanstack-form types are complex; form is properly typed via useForm
}

function CityFieldStep({
  isLoading,
  dirtyFields,
  setDirtyFields,
  form,
}: CityFieldStepProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Country Display - Read-only */}
      <form.Field name="country">
        {(field: {
          name: string;
          state: {
            value: string;
            meta: { errors: Array<{ message?: string }> };
          };
        }) => (
          <Field className="flex flex-col gap-2">
            <FieldLabel htmlFor={field.name}>Country of Birth</FieldLabel>
            <div className="flex h-10 w-full items-center gap-2 rounded-md border border-input bg-muted px-3 py-2 text-sm">
              <LockIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Việt Nam</span>
              <Badge variant="outline" className="ml-auto text-xs">
                Read-only
              </Badge>
            </div>
            <FieldDescription>
              Currently available for Vietnam only
            </FieldDescription>
            <FieldError errors={field.state.meta.errors} />
          </Field>
        )}
      </form.Field>
      <form.Field name="city">
        {(field: {
          name: string;
          state: {
            value: string;
            meta: { errors: Array<{ message?: string }>; isTouched: boolean };
          };
          handleChange: (value: string) => void;
          handleBlur: () => void;
        }) => {
          return (
            <Field className="flex flex-col gap-2">
              <FieldLabel htmlFor={field.name}>City of Birth</FieldLabel>
              <Combobox
                value={field.state.value}
                onValueChange={(value) => {
                  field.handleChange(value);
                  field.handleBlur();
                  setDirtyFields((prev) => new Set([...prev, "city"]));
                }}
                options={VIETNAM_CITIES}
                placeholder="Search and select a city"
                searchPlaceholder="Search cities..."
                disabled={isLoading}
                allowClear
                searchMode="client"
              />
              {Boolean(
                (dirtyFields.has("city") || field.state.meta.isTouched) &&
                  field.state.meta.errors?.length
              ) && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>
    </div>
  );
}

export default function OnboardingForm(props: Readonly<TOnboardingFormProps>) {
  const { onSubmit, isLoading, onStepChange } = props;
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [dirtyFields, setDirtyFields] = useState<Set<string>>(new Set());
  const totalSteps = 3;

  // Notify parent of step changes
  useEffect(() => {
    onStepChange?.(currentStep);
  }, [currentStep, onStepChange]);

  const form = useForm({
    defaultValues: defaultOnboardingFormValues,
    validators: {
      // @tanstack/react-form supports Zod schema directly but types are not fully compatible
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onBlur: onboardingFormSchema as any,
    },
  });

  const canSubmit = useStore(form.store, (state) => state.canSubmit);
  const values = useStore(form.store, (state) => state.values);

  // Initialize date from year/month/day if they exist but date doesn't
  useEffect(() => {
    if (
      !values.birthDate &&
      values.birthYear &&
      values.birthMonth &&
      values.birthDay
    ) {
      const year = parseInt(values.birthYear, 10);
      const month = parseInt(values.birthMonth, 10) - 1; // Month is 0-indexed
      const day = parseInt(values.birthDay, 10);
      const date = new Date(year, month, day);

      // Validate the date is correct
      if (
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day
      ) {
        form.setFieldValue("birthDate", date);
      }
    }
  }, [
    values.birthYear,
    values.birthMonth,
    values.birthDay,
    values.birthDate,
    form,
  ]);

  // Convert date to year/month/day when date changes
  useEffect(() => {
    if (values.birthDate) {
      const year = values.birthDate.getFullYear().toString();
      const month = (values.birthDate.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const day = values.birthDate.getDate().toString().padStart(2, "0");

      form.setFieldValue("birthYear", year);
      form.setFieldValue("birthMonth", month);
      form.setFieldValue("birthDay", day);
    }
  }, [values.birthDate, form]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      // Validate current step before proceeding
      if (validateCurrentStep()) {
        setCurrentStep(currentStep + 1);
        setValidationErrors({});
      } else {
        // Mark fields as dirty and show validation errors
        markStepFieldsAsDirty();
        showStepValidationErrors();
      }
    }
  };

  const markStepFieldsAsDirty = () => {
    const fieldsToMark = new Set<string>();
    if (currentStep === 1) {
      fieldsToMark.add("name");
    } else if (currentStep === 2) {
      fieldsToMark.add("birthDate");
      fieldsToMark.add("genderAtBirth");
      if (values.birthTimeKnown) {
        fieldsToMark.add("birthHour");
        fieldsToMark.add("birthMinute");
        fieldsToMark.add("birthPeriod");
      }
    } else if (currentStep === 3) {
      fieldsToMark.add("city");
    }
    setDirtyFields((prev) => new Set([...prev, ...fieldsToMark]));
  };

  const handlePrev = () => {
    setValidationErrors({});
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const showStepValidationErrors = () => {
    const errors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!values.name.trim()) {
        errors.name = "Name is required";
      }
    }
    if (currentStep === 2) {
      if (
        !values.birthDate &&
        (!values.birthYear || !values.birthMonth || !values.birthDay)
      ) {
        errors.birthDate = "Please select your date of birth";
      }
      if (!values.genderAtBirth) {
        errors.genderAtBirth = "Gender at birth is required";
      }
      if (values.birthTimeKnown) {
        if (!values.birthHour || !values.birthMinute || !values.birthPeriod) {
          errors.birthTime = "Please complete all time fields";
        }
      }
    }
    if (currentStep === 3) {
      if (!values.city.trim()) {
        errors.city = "City is required";
      }
    }
    setValidationErrors(errors);
  };

  const validateCurrentStep = (): boolean => {
    if (currentStep === 1) {
      return values.name.trim() !== "";
    }
    if (currentStep === 2) {
      const dateValid =
        Boolean(
          values.birthDate ||
            (values.birthYear && values.birthMonth && values.birthDay)
        ) && Boolean(values.genderAtBirth);

      // If time is known, validate time fields; otherwise, only date is required
      if (values.birthTimeKnown) {
        return Boolean(
          dateValid &&
            values.birthHour &&
            values.birthMinute &&
            values.birthPeriod
        );
      }
      return dateValid;
    }
    if (currentStep === 3) {
      return values.city.trim() !== "";
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
          <Card>
            <CardHeader>
              <CardTitle>Your Name</CardTitle>
              <CardDescription>
                We'll use this to personalize your experience
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                      onBlur={() => {
                        field.handleBlur();
                        setDirtyFields((prev) => new Set([...prev, "name"]));
                      }}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                        setDirtyFields((prev) => new Set([...prev, "name"]));
                        if (validationErrors.name) {
                          setValidationErrors((prev) => {
                            const next = { ...prev };
                            delete next.name;
                            return next;
                          });
                        }
                      }}
                      disabled={isLoading}
                      placeholder="Enter your name"
                      aria-invalid={Boolean(
                        (dirtyFields.has("name") ||
                          field.state.meta.isTouched) &&
                          (field.state.meta.errors?.length ||
                            validationErrors.name)
                      )}
                    />
                    {(dirtyFields.has("name") || field.state.meta.isTouched) &&
                      (field.state.meta.errors?.length ||
                        validationErrors.name) && (
                        <FieldError
                          errors={[
                            ...(field.state.meta.errors || []),
                            validationErrors.name
                              ? { message: validationErrors.name }
                              : undefined,
                          ].filter(Boolean)}
                        />
                      )}
                  </Field>
                )}
              </form.Field>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Date of Birth & Gender</CardTitle>
              <CardDescription>
                This helps us create your astrological profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {/* Date of Birth */}
                <form.Field name="birthDate">
                  {(field) => (
                    <Field className="flex flex-col gap-2">
                      <FieldLabel>Date of Birth</FieldLabel>
                      <DateOfBirthPicker
                        value={field.state.value}
                        onChange={(date) => {
                          field.handleChange(date);
                          setDirtyFields(
                            (prev) => new Set([...prev, "birthDate"])
                          );
                          if (validationErrors.birthDate) {
                            setValidationErrors((prev) => {
                              const next = { ...prev };
                              delete next.birthDate;
                              return next;
                            });
                          }
                        }}
                        onBlur={() => {
                          field.handleBlur();
                          setDirtyFields(
                            (prev) => new Set([...prev, "birthDate"])
                          );
                        }}
                        disabled={isLoading}
                        error={Boolean(
                          (dirtyFields.has("birthDate") ||
                            field.state.meta.isTouched) &&
                            (field.state.meta.errors?.length ||
                              validationErrors.birthDate)
                        )}
                      />
                      {(dirtyFields.has("birthDate") ||
                        field.state.meta.isTouched) &&
                        (field.state.meta.errors?.length ||
                          validationErrors.birthDate) && (
                          <FieldError
                            errors={[
                              ...(field.state.meta.errors || []),
                              validationErrors.birthDate
                                ? { message: validationErrors.birthDate }
                                : undefined,
                            ].filter(Boolean)}
                          />
                        )}
                    </Field>
                  )}
                </form.Field>

                {/* Time of Birth */}
                <form.Field name="birthTimeKnown">
                  {(field) => (
                    <Field className="flex flex-col gap-2">
                      <FieldLabel>Birth Time</FieldLabel>
                      <div className="rounded-md  p-1">
                        <RadioGroup
                          value={field.state.value ? "known" : "unknown"}
                          onValueChange={(value) => {
                            field.handleChange(value === "known");
                            setDirtyFields(
                              (prev) => new Set([...prev, "birthTimeKnown"])
                            );
                          }}
                          disabled={isLoading}
                          className="flex gap-2"
                        >
                          <RadioGroupItem value="unknown">
                            Unknown
                          </RadioGroupItem>
                          <RadioGroupItem value="known">
                            Enter time
                          </RadioGroupItem>
                        </RadioGroup>
                      </div>
                      {(dirtyFields.has("birthTimeKnown") ||
                        field.state.meta.isTouched) &&
                      field.state.meta.errors?.length ? (
                        <FieldError errors={field.state.meta.errors} />
                      ) : (
                        <></>
                      )}
                    </Field>
                  )}
                </form.Field>
                {values.birthTimeKnown && (
                  <div className="flex flex-col gap-4 rounded-md border border-input bg-muted/30 p-4">
                    <FieldDescription>
                      This helps us create a more accurate profile
                    </FieldDescription>
                    <div className="flex gap-2">
                      <form.Field name="birthHour">
                        {(field) => (
                          <Field className="flex-1">
                            <Select
                              value={field.state.value}
                              onValueChange={(value) => {
                                field.handleChange(value);
                                setDirtyFields(
                                  (prev) => new Set([...prev, "birthHour"])
                                );
                              }}
                              options={hours}
                              placeholder="Hour"
                              disabled={isLoading}
                            />
                            {(dirtyFields.has("birthHour") ||
                              field.state.meta.isTouched) &&
                              field.state.meta.errors?.length && (
                                <FieldError errors={field.state.meta.errors} />
                              )}
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
                                setDirtyFields(
                                  (prev) => new Set([...prev, "birthMinute"])
                                );
                              }}
                              options={minutes}
                              placeholder="Minute"
                              disabled={isLoading}
                            />
                            {(dirtyFields.has("birthMinute") ||
                              field.state.meta.isTouched) &&
                              field.state.meta.errors?.length && (
                                <FieldError errors={field.state.meta.errors} />
                              )}
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
                                setDirtyFields(
                                  (prev) => new Set([...prev, "birthPeriod"])
                                );
                              }}
                              options={periods}
                              placeholder="AM/PM"
                              disabled={isLoading}
                            />
                            {(dirtyFields.has("birthPeriod") ||
                              field.state.meta.isTouched) &&
                              field.state.meta.errors?.length && (
                                <FieldError errors={field.state.meta.errors} />
                              )}
                          </Field>
                        )}
                      </form.Field>
                    </div>
                    {validationErrors.birthTime &&
                      (dirtyFields.has("birthHour") ||
                        dirtyFields.has("birthMinute") ||
                        dirtyFields.has("birthPeriod")) && (
                        <FieldError
                          errors={[{ message: validationErrors.birthTime }]}
                        />
                      )}
                  </div>
                )}

                {/* Gender at Birth */}
                <form.Field name="genderAtBirth">
                  {(field) => (
                    <Field className="flex flex-col gap-2">
                      <FieldLabel>Gender</FieldLabel>
                      <div className="rounded-md p-1">
                        <RadioGroup
                          value={field.state.value}
                          onValueChange={(value) => {
                            field.handleChange(value as "male" | "female");
                            field.handleBlur();
                            setDirtyFields(
                              (prev) => new Set([...prev, "genderAtBirth"])
                            );
                            if (validationErrors.genderAtBirth) {
                              setValidationErrors((prev) => {
                                const next = { ...prev };
                                delete next.genderAtBirth;
                                return next;
                              });
                            }
                          }}
                          disabled={isLoading}
                          className="flex gap-2"
                        >
                          {genders.map((gender) => (
                            <RadioGroupItem
                              key={gender.value}
                              value={gender.value}
                            >
                              {gender.label}
                            </RadioGroupItem>
                          ))}
                        </RadioGroup>
                      </div>
                      {(dirtyFields.has("genderAtBirth") ||
                        field.state.meta.isTouched) &&
                        (field.state.meta.errors?.length ||
                          validationErrors.genderAtBirth) && (
                          <FieldError
                            errors={[
                              ...(field.state.meta.errors || []),
                              validationErrors.genderAtBirth
                                ? { message: validationErrors.genderAtBirth }
                                : undefined,
                            ].filter(Boolean)}
                          />
                        )}
                    </Field>
                  )}
                </form.Field>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Place of Birth</CardTitle>
              <CardDescription>
                Your location helps us provide region-specific insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CityFieldStep
                isLoading={Boolean(isLoading)}
                dirtyFields={dirtyFields}
                setDirtyFields={setDirtyFields}
                form={form}
              />
              {validationErrors.city && dirtyFields.has("city") && (
                <FieldError errors={[{ message: validationErrors.city }]} />
              )}
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <form className="flex size-full flex-col gap-6" onSubmit={handleFormSubmit}>
      {/* Content Card */}
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="transition-opacity duration-150 ease-out motion-reduce:transition-none">
          {renderStepContent()}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-2">
        {currentStep > 1 && (
          <Button
            type="button"
            variant="outline"
            onClick={handlePrev}
            disabled={isLoading}
            className="flex-1 min-h-[44px]"
          >
            Previous
          </Button>
        )}
        {currentStep < totalSteps ? (
          <Button
            type="button"
            onClick={handleNext}
            disabled={Boolean(isLoading || !validateCurrentStep())}
            className="flex-1 min-h-[44px]"
          >
            Next
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={!canSubmit || isLoading}
            className="flex-1 min-h-[44px]"
          >
            {isLoading ? "Processing..." : "Complete Setup"}
          </Button>
        )}
      </div>
    </form>
  );
}
