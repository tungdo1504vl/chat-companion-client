"use client";

import { useEffect, useRef } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import ReactTagsInput from "react-tagsinput";
import { BrainCog, Coffee, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
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
import { TProfileFormProps } from "../types";

export default function ProfileForm(props: Readonly<TProfileFormProps>) {
  const { onSubmit, isLoading, defaultValues } = props;
  const previousValuesRef = useRef<string | undefined>(undefined);

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
        form.reset({
          ...defaultProfileFormValues,
          ...defaultValues,
        });
        previousValuesRef.current = currentValuesString;
      }
    }
  }, [defaultValues, form]);

  const canSubmit = useStore(form.store, (state) => state.canSubmit);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form before submitting
    await form.validateAllFields("submit");

    // Check if form is valid
    if (!form.state.isValid) {
      return;
    }

    const value = form.state.values;
    onSubmit?.(value);
  };

  return (
    <form className="flex flex-col" onSubmit={handleFormSubmit}>
      {/* Form Content */}
      <div className="space-y-6">
        {/* Personality & Preference */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BrainCog className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold">
              Personality & Preference
            </h3>
          </div>

          <form.Field name="primaryLoveLanguage">
            {(field) => (
              <Field className="flex flex-col gap-2">
                <FieldLabel>Primary Love Language</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                  options={loveLanguages}
                  placeholder="Select love language"
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
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                  options={attachmentStyles}
                  placeholder="Select attachment style"
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
                      className: "react-tagsinput-tag text-white",
                      classNameRemove: "react-tagsinput-remove",
                    }}
                  />
                </div>
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>
        </div>

        {/* Lifestyle Snapshot */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold">Lifestyle Snapshot</h3>
          </div>

          <form.Field name="workSchedule">
            {(field) => (
              <Field className="flex flex-col gap-2">
                <FieldLabel>Work Schedule</FieldLabel>
                <div className="bg-gray-100 rounded-md p-px">
                  <RadioGroup
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
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
                </div>
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>

          <form.Field name="dateBudget">
            {(field) => (
              <Field className="flex flex-col gap-2">
                <FieldLabel>Date Budget</FieldLabel>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Low</span>
                    <span className="font-medium">${field.state.value}</span>
                    <span>High</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step={10}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    disabled={isLoading}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50"
                  />
                </div>
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>

          <form.Field name="socialEnergy">
            {(field) => (
              <Field className="flex flex-col gap-2">
                <FieldLabel>Social Energy Battery</FieldLabel>
                <div className="bg-gray-100 rounded-md p-px">
                  <RadioGroup
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                    disabled={isLoading}
                    className="flex gap-2"
                  >
                    {socialEnergyLevels.map((level) => (
                      <RadioGroupItem key={level.value} value={level.value}>
                        {level.label}
                      </RadioGroupItem>
                    ))}
                  </RadioGroup>
                </div>
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
                      placeholder: "Add a hobby",
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
        </div>

        {/* Social Signals */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold">Social Signals</h3>
          </div>

          <div className="space-y-3">
            <form.Field name="instagramLinked">
              {(field) => (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-gradient-to-br from-orange-400 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">IG</span>
                    </div>
                    <span className="font-medium">Instagram</span>
                  </div>
                  {field.state.value ? (
                    <span className="text-sm text-green-600">✓ Linked</span>
                  ) : (
                    <Button
                      type="button"
                      variant="link"
                      className="text-blue-600 p-0 h-auto"
                      onClick={() => field.handleChange(true)}
                      disabled={isLoading}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="facebookLinked">
              {(field) => (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">f</span>
                    </div>
                    <span className="font-medium">Facebook</span>
                  </div>
                  {field.state.value ? (
                    <span className="text-sm text-green-600">✓ Linked</span>
                  ) : (
                    <Button
                      type="button"
                      variant="link"
                      className="text-blue-600 p-0 h-auto"
                      onClick={() => field.handleChange(true)}
                      disabled={isLoading}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="threadsLinked">
              {(field) => (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center">
                      <span className="text-white text-xs font-bold">@</span>
                    </div>
                    <span className="font-medium">Threads</span>
                  </div>
                  {field.state.value ? (
                    <span className="text-sm text-green-600">✓ Linked</span>
                  ) : (
                    <Button
                      type="button"
                      variant="link"
                      className="text-blue-600 p-0 h-auto"
                      onClick={() => field.handleChange(true)}
                      disabled={isLoading}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              )}
            </form.Field>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex gap-2 pt-4 mt-6 border-t">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="default"
          className="flex-1 bg-primary"
          disabled={!canSubmit || isLoading}
        >
          <span className="mr-2">💾</span>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
