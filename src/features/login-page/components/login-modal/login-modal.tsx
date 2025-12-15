"use client";
import { useSignIn } from "../../hooks/use-sign-in";
import { LoginForm } from "../login-form";

export default function LoginModal() {
  const { mutate: signIn, isPending } = useSignIn();
  return (
    <div className="w-full h-screen mx-auto flex flex-col items-center justify-center p-4">
      <div className="w-full flex justify-center items-center">
        <LoginForm onSubmit={signIn} isLoading={isPending} />
      </div>
    </div>
  );
}
