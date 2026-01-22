import { Suspense } from 'react';
import { WinACrushSkeleton } from '@/features/win-a-crush';
import { PlanADayClient } from '@/features/plan-a-day';
import { MOCK_PARTNER_PROFILE } from '@/features/profile/partner/const';

type PageProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

export default async function PlanADayPage({ params }: PageProps) {
  const partnerParams = await params;
  const partnerId = partnerParams.id;

  return (
    <div className="flex flex-col h-full bg-background">
      <Suspense fallback={<WinACrushSkeleton />}>
        <PlanADayClient partnerProfile={MOCK_PARTNER_PROFILE} />
      </Suspense>
    </div>
  );
}
