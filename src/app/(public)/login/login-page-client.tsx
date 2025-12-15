"use client";

import { useSignIn } from "@/features/login-page/hooks/use-sign-in";
import { LoginForm } from "@/features/login-page/components/login-form";
import Link from "next/link";

export default function LoginPageClient() {
  const { mutate: signIn, isPending } = useSignIn();

  return (
    <div className="w-full h-screen mx-auto flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">
            Enter your email and password to sign in
          </p>
        </div>
        <LoginForm onSubmit={signIn} isLoading={isPending} />
        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
