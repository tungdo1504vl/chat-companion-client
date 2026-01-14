import AssistantLayout from "@/components/layout/assistant-layout";
import { PropsWithChildren } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/libs/better-auth/server";
import { PROTECTED_ROUTES } from "@/constants/routes";

export default async function Layout(props: Readonly<PropsWithChildren>) {
  const { children } = props;

  // Server-side validation: Check if user has completed onboarding
  // If not, redirect to onboarding page
  const user = await getCurrentUser();
  if (user && !user.hasCompletedOnboarding) {
    redirect(PROTECTED_ROUTES.ONBOARDING);
  }

  return <AssistantLayout>{children}</AssistantLayout>;
}
