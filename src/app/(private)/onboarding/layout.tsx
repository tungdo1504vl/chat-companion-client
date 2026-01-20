import ChatLayout from "@/components/layout/chat-layout";
import { PropsWithChildren } from "react";

export default async function OnboardingLayout(
  props: Readonly<PropsWithChildren>
) {
  const { children } = props;


  return <ChatLayout>{children}</ChatLayout>;
}
