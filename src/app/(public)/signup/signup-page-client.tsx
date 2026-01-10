"use client";

import { useSignUpUser } from "@/features/login-page/hooks/use-sign-up-user";
import { SignupForm } from "@/features/login-page/components/signup-form";
import Link from "next/link";
import { PUBLIC_ROUTES } from "@/constants/routes";

export default function SignupPageClient() {
  const { mutate: signUp, isPending } = useSignUpUser();

  return (
    <div className="w-full h-screen mx-auto flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="text-muted-foreground">
            Enter your email and password to sign up
          </p>
        </div>
        <SignupForm onSubmit={signUp} isLoading={isPending} />
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href={PUBLIC_ROUTES.LOGIN} className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

