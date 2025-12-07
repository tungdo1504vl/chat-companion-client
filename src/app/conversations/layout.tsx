import MainLayout from "@/components/layout/main-layout";

export default function ConversationsLayout(
  props: Readonly<{ children: React.ReactNode }>
) {
  const { children } = props;

  return <MainLayout>{children}</MainLayout>;
}
