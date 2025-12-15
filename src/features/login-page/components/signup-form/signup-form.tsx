"use client";

import { defaultSignupFormValues } from "./const";
import { signupFormSchema } from "./validate-schema";
import { useForm, useStore } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { TSignupFormProps } from "./types";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

export default function SignupForm(props: Readonly<TSignupFormProps>) {
  const { onSubmit, isLoading } = props;

  const form = useForm({
    defaultValues: defaultSignupFormValues,
    validators: {
      onBlur: signupFormSchema,
    },
  });

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const value = form.state.values;
    onSubmit?.(value);
  };

  const canSubmit = useStore(form.store, (state) => state.canSubmit);

  return (
    <form className="flex size-full flex-col gap-4" onSubmit={handleFormSubmit}>
      <form.Field name="email">
        {(field) => (
          <Field className="flex flex-col gap-2">
            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
            <Input
              id={field.name}
              autoComplete="email"
              name={field.name}
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              disabled={isLoading}
            />
            <FieldError errors={field.state.meta.errors} />
          </Field>
        )}
      </form.Field>
      <form.Field name="password">
        {(field) => (
          <Field className="flex flex-col gap-2">
            <FieldLabel htmlFor={field.name}>Password</FieldLabel>
            <Input
              type="password"
              autoComplete="new-password"
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              disabled={isLoading}
            />
            <FieldError errors={field.state.meta.errors} />
            <p className="text-sm text-muted-foreground">
              Password must be at least 8 characters with uppercase, lowercase,
              and a number
            </p>
          </Field>
        )}
      </form.Field>
      <Button type="submit" disabled={!canSubmit || isLoading}>
        {isLoading ? "Creating account..." : "Sign Up"}
      </Button>
    </form>
  );
}
