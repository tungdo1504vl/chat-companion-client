import AssistantLayout from '@/components/layout/assistant-layout';
import { PropsWithChildren } from 'react';

export default function Layout(props: Readonly<PropsWithChildren>) {
  const { children } = props;

  return <AssistantLayout>{children}</AssistantLayout>;
}
