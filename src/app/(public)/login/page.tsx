import { redirect } from "next/navigation";
import { getSession } from "@/libs/better-auth/server";
import LoginPageClient from "./login-page-client";
import { PROTECTED_ROUTES } from "@/constants";

export default async function LoginPage() {
  // Redirect if already authenticated
  const session = await getSession();
  if (session) {
    redirect(PROTECTED_ROUTES.CONVERSATIONS);
  }

  return <LoginPageClient />;
}
