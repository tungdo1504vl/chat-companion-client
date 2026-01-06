import ChatLayout from '@/components/layout/chat-layout';
import { PropsWithChildren } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/libs/better-auth/server';
import { PROTECTED_ROUTES } from '@/constants';

export default async function OnboardingLayout(
  props: Readonly<PropsWithChildren>
) {
  const { children } = props;

  // Server-side validation: Check if user has completed onboarding
  // Proxy handles optimistic checks, but we validate here for security
  const user = await getCurrentUser();
  if (user?.hasCompletedOnboarding) {
    redirect(PROTECTED_ROUTES.CONVERSATIONS);
  }

  return <ChatLayout>{children}</ChatLayout>;
}
