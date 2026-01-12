"use client";

import { useSignIn } from "@/features/login-page/hooks/use-sign-in";
import { LoginForm } from "@/features/login-page/components/login-form";
import { GoogleSignInButton } from "@/features/login-page/components/google-sign-in-button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { PUBLIC_ROUTES } from "@/constants/routes";

export default function LoginPageClient() {
  const { mutate: signIn, isPending } = useSignIn();

  return (
    <div className="w-full min-h-screen mx-auto flex flex-col items-center justify-center p-6 pb-24 sm:p-4 sm:pb-4">
      <div className="w-full max-w-md flex flex-col gap-5 sm:gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">
            Enter your email and password to sign in
          </p>
        </div>
        <GoogleSignInButton />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-sm sm:text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <LoginForm onSubmit={signIn} isLoading={isPending} />
        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href={PUBLIC_ROUTES.SIGNUP}
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
