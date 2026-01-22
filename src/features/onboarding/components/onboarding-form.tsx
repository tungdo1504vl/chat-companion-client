"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { PrimaryActionButton } from "@/components/commons/primary-action-button";
import { FormField, FormInput, FormSelect } from "@/components/forms";
import {
  defaultOnboardingFormValues,
  genders,
  countries,
} from "../const";
import { onboardingFormSchema } from "../validate-schema";
import { TOnboardingFormProps } from "../types";

export default function OnboardingForm(props: Readonly<TOnboardingFormProps>) {
  const { onSubmit, isLoading } = props;

  const form = useForm({
    defaultValues: defaultOnboardingFormValues,
    validators: {
      // @tanstack/react-form supports Zod schema directly but types are not fully compatible
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onBlur: onboardingFormSchema as any,
    },
  });

  const name = useStore(form.store, (state) => state.values.name);
  const gender = useStore(form.store, (state) => state.values.gender);
  const dob = useStore(form.store, (state) => state.values.dob);
  const country = useStore(form.store, (state) => state.values.country);
  const errors = useStore(form.store, (state) => state.errors);


  // Check if required fields are filled
  const isFormValid = name && gender && dob && country && Object.keys(errors).length === 0;


  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await form.handleSubmit();
    if (form.state.canSubmit) {
      onSubmit?.(form.state.values);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-screen overflow-y-auto max-h-screen">
      {/* Main Content */}
      <main className="grow px-6 pt-8 pb-14">
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-bold mb-3 text-[#2D2424] dark:text-[#F9FAFB]">
            Enter Information
          </h2>
          <p className="text-base text-[#8C7E7E] dark:text-[#9CA3AF] mb-8 leading-relaxed font-light">
            Provide info to reveal your portrait in a relationship
          </p>

          <form onSubmit={handleFormSubmit} id="onboarding-form" className="space-y-6">
            <div className="bg-[#FFFFFF] dark:bg-[#2D2424] rounded-2xl p-6 shadow-[0_10px_30px_-5px_rgba(255,107,107,0.08),0_4px_10px_-2px_rgba(0,0,0,0.01)] border border-[#F5E6E0] dark:border-gray-800 space-y-6">
              {/* Name Field */}
              <form.Field name="name">
                {(field) => (
                  <FormField
                    label="Name"
                    htmlFor={field.name}
                    error={field.state.meta.isTouched && field.state.meta.errors ? field.state.meta.errors : undefined}
                    labelClassName="text-sm font-semibold font-sans text-[#2D2424] dark:text-[#F9FAFB] tracking-wide"
                  >
                    <FormInput
                      id={field.name}
                      name={field.name}
                      type="text"
                      field={field}
                      disabled={isLoading}
                      placeholder="Enter your name"
                    />
                  </FormField>
                )}
              </form.Field>

              {/* Gender Field */}
              <form.Field name="gender">
                {(field) => (
                  <FormField
                    label="Gender"
                    htmlFor="gender"
                    error={field.state.meta.isTouched && field.state.meta.errors ? field.state.meta.errors : undefined}
                    labelClassName="text-sm font-semibold font-sans text-[#2D2424] dark:text-[#F9FAFB] tracking-wide"
                  >
                    <FormSelect
                      field={field}
                      options={genders}
                      placeholder="Select gender"
                      disabled={isLoading}
                    />
                  </FormField>
                )}
              </form.Field>

              {/* Date of Birth Field */}
              <form.Field name="dob">
                {(field) => (
                  <FormField
                    label="Date of Birth"
                    htmlFor="dob"
                    error={field.state.meta.isTouched && field.state.meta.errors ? field.state.meta.errors : undefined}
                    labelClassName="text-sm font-semibold font-sans text-[#2D2424] dark:text-[#F9FAFB] tracking-wide"
                  >
                    <FormInput
                      id={field.name}
                      name={field.name}
                      type="date"
                      field={field}
                      disabled={isLoading}
                    />
                  </FormField>
                )}
              </form.Field>

              {/* Country Field */}
              <form.Field name="country">
                {(field) => (
                  <FormField
                    label="Country"
                    htmlFor="country"
                    error={field.state.meta.isTouched && field.state.meta.errors.length > 0 ? field.state.meta.errors : undefined}
                    labelClassName="text-sm font-semibold font-sans text-[#2D2424] dark:text-[#F9FAFB] tracking-wide"
                  >
                    <FormSelect
                      field={field}
                      options={countries}
                      placeholder="Select country"
                      disabled={isLoading}
                    />
                  </FormField>
                )}
              </form.Field>
            </div>
          </form>
        </div>
      </main>

      {/* Footer with Button */}
      <div className="flex-none bg-[#FFF9F5] dark:bg-[#1F1A1A] px-6 pt-3 pb-8 transition-colors duration-200">
        <div className="max-w-md mx-auto">
          <PrimaryActionButton
            type="submit"
            form="onboarding-form"
            disabled={!isFormValid || isLoading}
            label={isLoading ? "Processing..." : "Next"}
            className="size-full"
          />
        </div>
      </div>
    </div>
  );
}
