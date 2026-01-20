import { Suspense } from 'react';
import { WinACrushSkeleton } from '@/features/win-a-crush';
import { GiftSuggestClient } from '@/features/gift-suggest';
import { MOCK_PARTNER_PROFILE } from '@/features/profile/partner/const';

type PageProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

export default async function GiftSuggestPage({ params }: PageProps) {
  const partnerParams = await params;
  const partnerId = partnerParams.id;

  return (
    <div className="flex flex-col h-full bg-background">
      <Suspense fallback={<WinACrushSkeleton />}>
        <GiftSuggestClient partnerProfile={MOCK_PARTNER_PROFILE} />
      </Suspense>
    </div>
  );
}
