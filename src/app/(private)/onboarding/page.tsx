'use client';

import { COUNTRY_LIST } from '@/constants/data';
import { OnboardingForm } from '@/features/onboarding/components';
import { useOnboarding } from '@/features/onboarding/hooks/use-onboarding';
import { TOnboardingFormData } from '@/features/onboarding/types';
import { TCommonPayload } from '@/services/user.service';

export default function OnboardingPage() {
  const mutateOnboarding = useOnboarding();
  
  const handleSubmit = async (formData: TOnboardingFormData) => {
    const birthDay = `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`;
    const birthTime = `${formData.birthHour}:${formData.birthMinute}:00`;
    const countryName = COUNTRY_LIST.find(
      (item) => item.code === formData.country
    )?.name;
    
    const payload: TCommonPayload = {
      task_type: 'user_profile_validate',
      input_args: {
        name: formData.name,
        gender: formData.genderAtBirth,
        dob: birthDay,
        time_of_birth: birthTime,
        country_of_birth: countryName || '',
        city_of_birth: formData.city,
      },
      priority: 'high',
    };
    
    await mutateOnboarding.mutateAsync(payload);
  };

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <OnboardingForm onSubmit={handleSubmit} />
    </div>
  );
}
