"use client";

import { defaultLoginFormValues } from "./const";
import { loginFormSchema } from "./validate-schema";
import { useForm, useStore } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { TLoginFormProps } from "./types";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Loader2 } from "lucide-react";

export default function LoginForm(props: Readonly<TLoginFormProps>) {
  const { onSubmit, isLoading } = props;

  const form = useForm({
    defaultValues: defaultLoginFormValues,
    validators: {
      onBlur: loginFormSchema,
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
              autoComplete="current-password"
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              disabled={isLoading}
            />
            <FieldError errors={field.state.meta.errors} />
          </Field>
        )}
      </form.Field>
      <Button type="submit" disabled={!canSubmit || isLoading}>
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
