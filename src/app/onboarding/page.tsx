'use client';

import { OnboardingForm } from '@/features/onboarding/components';
import { TOnboardingFormData } from '@/features/onboarding/types';

export default function OnboardingPage() {
  const handleSubmit = (data: TOnboardingFormData) => {
    console.log('Onboarding data:', data);
    // TODO: Implement API call to save onboarding data
  };

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <OnboardingForm onSubmit={handleSubmit} />
    </div>
  );
}
