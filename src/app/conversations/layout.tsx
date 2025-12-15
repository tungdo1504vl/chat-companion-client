import MainLayout from "@/components/layout/main-layout";

/**
 * Protected route layout
 * Authentication is handled by middleware.ts at the edge
 * No need to check session here as middleware already protects this route
 */
export default function ConversationsLayout(
  props: Readonly<{ children: React.ReactNode }>
) {
  const { children } = props;

  return <MainLayout>{children}</MainLayout>;
}
