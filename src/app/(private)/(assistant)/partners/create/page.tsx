'use client';

import { useRouter } from 'next/navigation';
import { ASSISTANT_ROUTES } from '@/constants/routes';
import { PartnerForm } from '@/features/partner-form';
import { TPartnerFormData } from '@/features/partner-form/types';
import { toast } from 'sonner';
import { TCommonPayload } from '@/types/common';
import { useCommonCompute } from '@/hooks/use-compute';
import { useSession } from '@/libs/better-auth/client';
import { TASK_TYPE } from '@/constants/task';
import { useQueryClient } from '@/libs/react-query';

export default function PartnerCreatePage() {
  const router = useRouter();
  const mutatePartner = useCommonCompute();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const userId = session?.user.id;

  const handleSubmit = async (formData: TPartnerFormData) => {
    console.log('Partner form data:', formData);
    if (!userId) return;
    const partner_profile = {
      basic_info: {
        gender: formData.partnerGender,
        name: formData.partnerName,
      },
      current_situation: formData.situationDescription,
      what_ultimately_want: formData.ultimateGoal,
      goals: [formData.ultimateGoal],
      partner_personality: formData.partnerPersonality,
      past_events_summary: formData.majorPastEvents,
      current_feelings: formData.currentFeelings,
    };
    const payload: TCommonPayload = {
      task_type: TASK_TYPE.PARTNER_PROFILE_CREATE,
      input_args: {
        user_id: session?.user.id,
        partner_profile: partner_profile,
      },
      priority: 'high',
    };
    const res = await mutatePartner.mutateAsync(payload);
    console.log('res:', res);
    await queryClient.invalidateQueries({
      queryKey: ['compute', TASK_TYPE.PARTNER_PROFILE_LIST],
    });
    toast.success('Successfully');
    // Navigate to partners page after form submission
    router.push(ASSISTANT_ROUTES.PARTNERS);
  };

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <PartnerForm onSubmit={handleSubmit} />
    </div>
  );
}
