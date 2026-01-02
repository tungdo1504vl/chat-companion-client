import { useMutation } from '@/libs/react-query';
import userService, { TOnboardingPayload } from '@/services/user.service';

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
