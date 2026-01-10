import { redirect } from "next/navigation";
import { getSession } from "@/libs/better-auth/server";
import SignupPageClient from "./signup-page-client";
import { PROTECTED_ROUTES } from "@/constants/routes";

export default async function SignupPage() {
  // Redirect if already authenticated
  const session = await getSession();
  if (session) {
    redirect(PROTECTED_ROUTES.CONVERSATIONS);
  }

  return <SignupPageClient />;
}
