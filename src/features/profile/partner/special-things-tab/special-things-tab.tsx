import { useCommonCompute } from '@/hooks/use-compute';
import {
  SpecialDaysSection,
  SmartGiftIdeasSection,
  PlanBirthdaySection,
} from '../components';
import type { PartnerProfile, SpecialDay } from '../types';
import { TCommonPayload } from '@/types/common';
import { TASK_TYPE } from '@/constants/task';
import { useSession } from '@/libs/better-auth/client';

type SpecialThingsTabProps = Readonly<{
  profile: PartnerProfile;
  onSpecialDaysChange?: (days: SpecialDay[]) => void;
}>;

export default function SpecialThingsTab({
  profile,
  onSpecialDaysChange,
}: SpecialThingsTabProps) {
  const birthday = profile.specialDays?.find((day) => day.type === 'birthday');
  const mutatePartner = useCommonCompute();
  const { data: session } = useSession();
  const userId = session?.user.id;

  const handleGenerateGiftIdea = async () => {
    const payload: TCommonPayload = {
      task_type: TASK_TYPE.PARTNER_GIFT_IDEAS,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      input_args: {
        user_id: userId,
        partner_id: profile.id,
      } as any,
      priority: 'high',
    };
    const res = await mutatePartner.mutateAsync(payload);
    console.log('handleGenerateGiftIdea res:', res);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Special Days Section */}
      <SpecialDaysSection
        specialDays={profile.specialDays}
        onChange={onSpecialDaysChange}
      />

      {/* Smart Gift Ideas Section */}
      <SmartGiftIdeasSection
        giftIdeas={profile.giftIdeas}
        hobbies={profile.hobbies}
        onGenerateGiftIdeas={handleGenerateGiftIdea}
      />

      {/* Plan for Birthday Section */}
      {birthday && <PlanBirthdaySection birthday={birthday} />}
    </div>
  );
}
