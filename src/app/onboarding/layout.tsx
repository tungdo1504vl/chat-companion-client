import ChatLayout from '@/components/layout/chat-layout';
import { PropsWithChildren } from 'react';

export default function OnboardingLayout(props: Readonly<PropsWithChildren>) {
  const { children } = props;

  return <ChatLayout>{children}</ChatLayout>;
}
