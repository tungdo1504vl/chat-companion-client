"use client";

import { useSignIn } from "@/features/login-page/hooks/use-sign-in";
import { LoginForm } from "@/features/login-page/components/login-form";
import { GoogleSignInButton } from "@/features/login-page/components/google-sign-in-button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { PUBLIC_ROUTES } from "@/constants/routes";

export default function LoginPageClientV2() {
  const { mutate: signIn, isPending } = useSignIn();

  return (
    <div className="auth-background-warm flex items-center justify-center p-6 min-h-screen relative overflow-hidden">
      {/* Decorative blur circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-romantic-50 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cream-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-blush-100 rounded-full blur-2xl opacity-20"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Glass-morphism card */}
        <div className="bg-white/85 backdrop-blur-lg rounded-[32px] p-8 sm:p-10 shadow-2xl border border-romantic-100/40 relative overflow-hidden">
          {/* Decorative blur circle inside card */}
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-romantic-50 rounded-full blur-2xl opacity-50"></div>

          <div className="relative z-10 flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-3 text-center">
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-slate-900 leading-tight">
                Welcome back
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                Enter your email and password to sign in
              </p>
            </div>

            {/* Google Sign In */}
            <GoogleSignInButton />

            {/* Separator */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="bg-romantic-100/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/85 px-3 text-slate-500 font-semibold tracking-wider">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Login Form */}
            <LoginForm onSubmit={signIn} isLoading={isPending} />

            {/* Sign up link */}
            <div className="text-center text-sm text-slate-600">
              Don&apos;t have an account?{" "}
              <Link
                href={PUBLIC_ROUTES.SIGNUP}
                className="text-romantic-500 hover:text-romantic-600 hover:underline font-semibold transition-colors duration-150"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
