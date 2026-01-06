import { useMutation } from '@/libs/react-query';
import userService from '@/services/user.service';
import { TOnboardingPayload } from '@/types/common';

export const useOnboarding = () => {
  const signInMutation = useMutation({
    mutationFn: async (data: TOnboardingPayload) => {
      return await userService.submit(data);
    },
    onSuccess: async (response) => {},
    onError: (error) => {},
  });

  return signInMutation;
};
