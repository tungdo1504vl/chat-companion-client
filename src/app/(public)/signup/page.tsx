import { redirect } from "next/navigation";
import { getSession } from "@/libs/better-auth/server";
import { PROTECTED_ROUTES } from "@/constants/routes";
import SignupPageClientV2 from "./signup-page-client-v2";

export default async function SignupPage() {
  // Redirect if already authenticated
  const session = await getSession();
  if (session) {
    redirect(PROTECTED_ROUTES.CONVERSATIONS);
  }

  return <SignupPageClientV2 />;
}
