'use client';

import { useRouter } from 'next/navigation';
import { PartnerForm } from '@/features/partner-form';
import { TPartnerFormData } from '@/features/partner-form/types';
import { toast } from 'sonner';
import { TCommonPayload } from '@/types/common';
import { useCommonCompute } from '@/hooks/use-compute';
import { useSession } from '@/libs/better-auth/client';
import { TASK_TYPE } from '@/constants/task';

export default function PartnerCreatePage() {
  const router = useRouter();
  const mutatePartner = useCommonCompute();
  const { data: session } = useSession();
  const userId = session?.user.id;
  console.log('userId:', userId);

  const handleSubmit = async (formData: TPartnerFormData) => {
    console.log('Partner form data:', formData);
    if (!userId) return;
    const payload: TCommonPayload = {
      task_type: TASK_TYPE.PARTNER_PROFILE_CREATE,
      input_args: {
        user_id: session?.user.id,
        partner_profile: {
          partner_id: 'string',
          basic_info: {
            name: 'string',
            nickname: 'string',
            avatar_url: 'string',
            gender: 'string',
            age: 0,
            city: 'string',
            location: 'string',
            relationship_stage: 'string',
            dob: 'string',
            time_of_birth: 'string',
            country_of_birth: 'string',
            city_of_birth: 'string',
            timezone_offset: 'string',
          },
          current_situation: 'string',
          what_you_want: 'string',
          what_ultimately_want: 'string',
          partner_personality: 'string',
          past_events_summary: 'string',
          current_feelings: 'string',
          goals: ['string'],
          goals_is_ai_generated: false,
          personality: {
            love_languages: ['string'],
            communication_styles: ['string'],
            attachment_style: 'string',
            deal_breakers: ['string'],
          },
          lifestyle: {
            work_schedule: 'string',
            date_budget: 0,
            social_energy_level: 'string',
            hobbies: ['string'],
          },
          social_links: {
            instagram: 'string',
            facebook: 'string',
            threads: 'string',
            tiktok: 'string',
          },
          things_they_appreciate: ['string'],
          special_days: [
            {
              id: 'string',
              name: 'string',
              date: 'string',
              type: 'string',
              icon: 'string',
              icon_color: 'string',
              notifications_enabled: false,
            },
          ],
          is_premium: false,
          love_language: 'string',
          love_language_is_ai_generated: false,
          communication_styles: ['string'],
          communication_styles_is_ai_generated: false,
          attachment_tendency: {
            tendency: 'string',
            label: 'string',
            description: 'string',
            is_ai_generated: false,
          },
          deal_breakers: ['string'],
          appreciated_things: ['string'],
          appreciated_things_is_ai_generated: false,
          work_rhythm: 'string',
          work_rhythm_is_ai_generated: false,
          social_energy_level: 'string',
          social_energy_level_is_ai_generated: false,
          cycle_tracking: {
            is_private: false,
            predicted_start: 'string',
            predicted_end: 'string',
          },
          date_budget: 'string',
          date_budget_is_ai_generated: false,
          hobbies: ['string'],
          hobbies_is_ai_generated: false,
          favorite_hobbies: ['string'],
          social_signals: [
            {
              title: 'string',
              description: 'string',
              icon: 'string',
              is_ai_generated: false,
            },
          ],
          social_signal_tags: ['string'],
          interest_level: 'string',
          interest_level_confidence: 0,
          mood_trend: 'string',
          chemistry_score: 0,
          chemistry_score_description: 'string',
          what_works_well: 'string',
          gift_ideas: [
            {
              id: 'string',
              name: 'string',
              price: 0,
              tag: 'string',
              icon: 'string',
              icon_color: 'string',
              ai_curated: false,
              rationale: 'string',
            },
          ],
        },
      },
      priority: 'high',
    };
    const res = await mutatePartner.mutateAsync(payload);
    console.log('res:', res);
    toast.success('Successfully');
    // Navigate to history page after form submission
    router.push('/history');
  };

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <PartnerForm onSubmit={handleSubmit} />
    </div>
  );
}
