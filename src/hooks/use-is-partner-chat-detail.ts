// hooks/use-is-partner-chat-detail.ts
'use client';

import { usePathname } from 'next/navigation';

const PARTNER_CHAT_DETAIL_REGEX = /^\/partners\/chat\/[a-f0-9]{32}$/i;

export function useIsPartnerChatDetail() {
  const pathname = usePathname();

  return PARTNER_CHAT_DETAIL_REGEX.test(pathname);
}
