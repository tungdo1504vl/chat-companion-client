import { useMutation } from '@/libs/react-query';
import userService, { TOnboardingPayload } from '@/services/user.service';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from '@/libs/better-auth/client';
import { PROTECTED_ROUTES } from '@/constants';
import { toast } from 'sonner';

export const useOnboarding = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refetch: refetchSession } = useSession();

  const onboardingMutation = useMutation({
    mutationFn: async (data: TOnboardingPayload) => {
      // First submit the onboarding data
      const response = await userService.submit(data);
      
      // Then mark onboarding as complete
      const completeResponse = await fetch('/api/onboarding/complete', {
        method: 'POST',
      });

      if (!completeResponse.ok) {
        throw new Error('Failed to complete onboarding');
      }

      return response;
    },
    onSuccess: async () => {
      // Refresh session to get updated user data
      await refetchSession();
      
      toast.success('Onboarding completed successfully');
      
      // Redirect to intended destination or default to conversations
      const redirectPath = searchParams.get('redirect') || PROTECTED_ROUTES.CONVERSATIONS;
      router.push(redirectPath);
      router.refresh();
    },
    onError: (error) => {
      console.error('Onboarding error:', error);
      toast.error('Failed to complete onboarding', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    },
  });

  return onboardingMutation;
};
