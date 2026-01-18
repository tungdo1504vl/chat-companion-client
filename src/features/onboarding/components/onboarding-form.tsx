"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/commons/select";
import {
  FieldError,
} from "@/components/ui/field";
import {
  defaultOnboardingFormValues,
  genders,
  countries,
} from "../const";
import { onboardingFormSchema } from "../validate-schema";
import { TOnboardingFormProps } from "../types";
import { cn } from "@/libs/tailwind/utils";

export default function OnboardingForm(props: Readonly<TOnboardingFormProps>) {
  const { onSubmit, isLoading } = props;
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [dirtyFields, setDirtyFields] = useState<Set<string>>(new Set());

  const form = useForm({
    defaultValues: defaultOnboardingFormValues,
    validators: {
      // @tanstack/react-form supports Zod schema directly but types are not fully compatible
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onBlur: onboardingFormSchema as any,
    },
  });

  const canSubmit = form.state.canSubmit;
  const values = form.state.values;

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (canSubmit) {
      const value = form.state.values;
      onSubmit?.(value);
    } else {
      // Mark all fields as dirty and show validation errors
      setDirtyFields(new Set(["name", "gender", "dob", "country"]));
      const errors: Record<string, string> = {};
      if (!values.name.trim()) errors.name = "Name is required";
      if (!values.gender) errors.gender = "Gender is required";
      if (!values.dob) errors.dob = "Date of birth is required";
      if (!values.country) errors.country = "Country is required";
      setValidationErrors(errors);
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
              <div>
                <label
                  className="block text-sm font-semibold font-serif text-[#2D2424] dark:text-[#F9FAFB] mb-2 tracking-wide"
                  htmlFor="name"
                >
                  Name
                </label>
                <div className="relative">
                  <form.Field name="name">
                    {(field) => (
                      <>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="text"
                          value={field.state.value}
                          onBlur={() => {
                            field.handleBlur();
                            setDirtyFields((prev) => new Set([...prev, "name"]));
                            if (validationErrors.name) {
                              setValidationErrors((prev) => {
                                const next = { ...prev };
                                delete next.name;
                                return next;
                              });
                            }
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
                          className={cn(
                            "w-full h-full bg-[#FFFFFF] dark:bg-[#3D3131] border-gray-200 dark:border-gray-700 focus:border-[#FF6B6B] focus:ring-1 focus:ring-[#FF6B6B]/20 rounded-xl py-4 px-4 text-[#2D2424] dark:text-[#F9FAFB] placeholder-gray-400 dark:placeholder-gray-500 transition-all text-base outline-none ring-0",
                            Boolean(
                              (dirtyFields.has("name") || field.state.meta.isTouched) &&
                              (field.state.meta.errors?.length || validationErrors.name)
                            ) && "border-red-500 dark:border-red-500"
                          )}
                          aria-invalid={Boolean(
                            (dirtyFields.has("name") || field.state.meta.isTouched) &&
                            (field.state.meta.errors?.length || validationErrors.name)
                          )}
                        />
                        {(dirtyFields.has("name") || field.state.meta.isTouched) &&
                          (field.state.meta.errors?.length || validationErrors.name) && (
                            <FieldError
                              errors={[
                                ...(field.state.meta.errors || []),
                                validationErrors.name
                                  ? { message: validationErrors.name }
                                  : undefined,
                              ].filter(Boolean)}
                            />
                          )}
                      </>
                    )}
                  </form.Field>
                </div>
              </div>

              {/* Gender Field */}
              <div>
                <label
                  className="block text-sm font-semibold font-serif text-[#2D2424] dark:text-[#F9FAFB] mb-2 tracking-wide"
                  htmlFor="gender"
                >
                  Gender
                </label>
                <div className="relative">
                  <form.Field name="gender">
                    {(field) => (
                      <>
                        <div className="[&_button]:w-full [&_button]:h-full [&_button]:bg-[#FFFFFF] [&_button]:dark:bg-[#3D3131] [&_button]:border-gray-200 [&_button]:dark:border-gray-700 [&_button]:focus:border-[#FF6B6B] [&_button]:focus:ring-1 [&_button]:focus:ring-[#FF6B6B]/20 [&_button]:rounded-xl [&_button]:py-4 [&_button]:px-4 [&_button]:text-[#2D2424] [&_button]:dark:text-[#F9FAFB] [&_button]:placeholder-gray-400 [&_button]:dark:placeholder-gray-500 [&_button]:transition-all [&_button]:text-base [&_button]:outline-none [&_button]:ring-0 [&_button]:justify-between">
                          <Select
                            triggerClassName="data-[size=default]:h-full"
                            optionClassName="py-4"
                            value={field.state.value}
                            onValueChange={(value) => {
                              field.handleChange(value as "female" | "male");
                              field.handleBlur();
                              setDirtyFields((prev) => new Set([...prev, "gender"]));
                              if (validationErrors.gender) {
                                setValidationErrors((prev) => {
                                  const next = { ...prev };
                                  delete next.gender;
                                  return next;
                                });
                              }
                            }}
                            options={genders}
                            placeholder="Select gender"
                            disabled={isLoading}
                          />
                        </div>
                        {(dirtyFields.has("gender") || field.state.meta.isTouched) &&
                          (field.state.meta.errors?.length || validationErrors.gender) && (
                            <FieldError
                              errors={[
                                ...(field.state.meta.errors || []),
                                validationErrors.gender
                                  ? { message: validationErrors.gender }
                                  : undefined,
                              ].filter(Boolean)}
                            />
                          )}
                      </>
                    )}
                  </form.Field>
                </div>
              </div>

              {/* Date of Birth Field */}
              <div>
                <label
                  className="block text-sm font-semibold font-serif text-[#2D2424] dark:text-[#F9FAFB] mb-2 tracking-wide"
                  htmlFor="dob"
                >
                  Date of Birth
                </label>
                <div className="relative">
                  <form.Field name="dob">
                    {(field) => (
                      <>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="date"
                          value={field.state.value}
                          onBlur={() => {
                            field.handleBlur();
                            setDirtyFields((prev) => new Set([...prev, "dob"]));
                            if (validationErrors.dob) {
                              setValidationErrors((prev) => {
                                const next = { ...prev };
                                delete next.dob;
                                return next;
                              });
                            }
                          }}
                          onChange={(e) => {
                            field.handleChange(e.target.value);
                            setDirtyFields((prev) => new Set([...prev, "dob"]));
                            if (validationErrors.dob) {
                              setValidationErrors((prev) => {
                                const next = { ...prev };
                                delete next.dob;
                                return next;
                              });
                            }
                          }}
                          disabled={isLoading}
                          className={cn(
                            "size-full bg-[#FFFFFF] dark:bg-[#3D3131] border-gray-200 dark:border-gray-700 focus:border-[#FF6B6B] focus:ring-1 focus:ring-[#FF6B6B]/20 rounded-xl py-4 px-4 text-[#2D2424] dark:text-[#F9FAFB] placeholder-gray-400 dark:placeholder-gray-500 transition-all text-base outline-none ring-0",
                            (dirtyFields.has("dob") || field.state.meta.isTouched) &&
                            (field.state.meta.errors?.length || validationErrors.dob) &&
                            "border-red-500 dark:border-red-500"
                          )}
                          aria-invalid={Boolean(
                            (dirtyFields.has("dob") || field.state.meta.isTouched) &&
                            (field.state.meta.errors?.length || validationErrors.dob)
                          )}
                        />
                        {(dirtyFields.has("dob") || field.state.meta.isTouched) &&
                          (field.state.meta.errors?.length || validationErrors.dob) && (
                            <FieldError
                              errors={[
                                ...(field.state.meta.errors || []),
                                validationErrors.dob
                                  ? { message: validationErrors.dob }
                                  : undefined,
                              ].filter(Boolean)}
                            />
                          )}
                      </>
                    )}
                  </form.Field>
                </div>
              </div>

              {/* Country Field */}
              <div>
                <label
                  className="block text-sm font-semibold font-serif text-[#2D2424] dark:text-[#F9FAFB] mb-2 tracking-wide"
                  htmlFor="country"
                >
                  Country
                </label>
                <div className="relative">
                  <form.Field name="country">
                    {(field) => (
                      <>
                        <div className="[&_button]:w-full [&_button]:h-full [&_button]:bg-[#FFFFFF] [&_button]:dark:bg-[#3D3131] [&_button]:border-gray-200 [&_button]:dark:border-gray-700 [&_button]:focus:border-[#FF6B6B] [&_button]:focus:ring-1 [&_button]:focus:ring-[#FF6B6B]/20 [&_button]:rounded-xl [&_button]:py-4 [&_button]:px-4 [&_button]:text-[#2D2424] [&_button]:dark:text-[#F9FAFB] [&_button]:placeholder-gray-400 [&_button]:dark:placeholder-gray-500 [&_button]:transition-all [&_button]:text-base [&_button]:outline-none [&_button]:ring-0 [&_button]:justify-between">
                          <Select
                            triggerClassName="data-[size=default]:h-full"
                            value={field.state.value}
                            onValueChange={(value) => {
                              field.handleChange(value);
                              field.handleBlur();
                              setDirtyFields((prev) => new Set([...prev, "country"]));
                              if (validationErrors.country) {
                                setValidationErrors((prev) => {
                                  const next = { ...prev };
                                  delete next.country;
                                  return next;
                                });
                              }
                            }}
                            options={countries}
                            placeholder="Select country"
                            disabled={isLoading}
                          />
                        </div>
                        {(dirtyFields.has("country") || field.state.meta.isTouched) &&
                          (field.state.meta.errors?.length || validationErrors.country) && (
                            <FieldError
                              errors={[
                                ...(field.state.meta.errors || []),
                                validationErrors.country
                                  ? { message: validationErrors.country }
                                  : undefined,
                              ].filter(Boolean)}
                            />
                          )}
                      </>
                    )}
                  </form.Field>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Footer with Button */}
      <div className="flex-none bg-[#FFF9F5] dark:bg-[#1F1A1A] px-6 pt-3 pb-8 transition-colors duration-200">
        <div className="max-w-md mx-auto">
          <Button
            type="submit"
            form="onboarding-form"
            disabled={!canSubmit || isLoading}
            className="size-full py-5 px-6 rounded-2xl bg-[#FF6B6B] hover:bg-[#FF5252] text-white font-semibold transition-all duration-300 text-center shadow-[0_8px_20px_-4px_rgba(255,107,107,0.4)] transform hover:-translate-y-0.5 active:translate-y-0 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? "Processing..." : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
