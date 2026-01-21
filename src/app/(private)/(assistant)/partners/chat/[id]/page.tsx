import { Suspense } from 'react';
// import PartnerChatPageClient from './partner-chat-page-client';
import PartnerChatPageSkeleton from './partner-chat-page-skeleton';
import PartnerChatPageClient from './partner-chat-page-client';
import { MOCK_PARTNER_PROFILE } from '@/features/profile/partner/const';

type PartnerChatPageProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

export default async function PartnerChatPage({
  params,
}: PartnerChatPageProps) {
  const partnerParams = await params;
  // Hardcode partner id for demo
  const partnerId = MOCK_PARTNER_PROFILE.id;

  return (
    <Suspense fallback={<PartnerChatPageSkeleton />}>
      <PartnerChatPageClient partnerId={partnerId} />
    </Suspense>
  );
}
