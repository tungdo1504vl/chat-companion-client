'use client';

import { useRouter } from 'next/navigation';
import { PartnerForm } from '@/features/partner-form';
import { TPartnerFormData } from '@/features/partner-form/types';

export default function PartnerCreatePage() {
  const router = useRouter();

  const handleSubmit = (formData: TPartnerFormData) => {
    console.log('Partner form data:', formData);
    // Navigate to history page after form submission
    router.push('/history');
  };

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <PartnerForm onSubmit={handleSubmit} />
    </div>
  );
}
