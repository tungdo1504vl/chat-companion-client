import { redirect } from "next/navigation";
import { getSession } from "@/libs/better-auth/server";
import { PUBLIC_ROUTES } from "@/constants/routes";
import LoginPageClientV2 from "./login-page-client-v2";

export default async function LoginPage() {
  // Redirect if already authenticated
  const session = await getSession();
  if (session) {
    redirect(PUBLIC_ROUTES.HOME);
  }

  return <LoginPageClientV2 />;
}
