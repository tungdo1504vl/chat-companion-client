import { Suspense } from 'react';
import PartnerChatPageClient from './partner-chat-page-client';
import PartnerChatPageSkeleton from './partner-chat-page-skeleton';

type PartnerChatPageProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

export default async function PartnerChatPage({
  params,
}: PartnerChatPageProps) {
  const partnerParams = await params;
  const partnerId = partnerParams.id;

  return (
    <Suspense fallback={<PartnerChatPageSkeleton />}>
      <PartnerChatPageClient partnerId={partnerId} />
    </Suspense>
  );
}
