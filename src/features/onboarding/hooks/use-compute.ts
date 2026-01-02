import { useMutation } from '@/libs/react-query';
import userService, { TCommonPayload } from '@/services/user.service';

export const useCompute = () => {
  const signInMutation = useMutation({
    mutationFn: async (data: TCommonPayload) => {
      return await userService.compute(data);
    },
    onSuccess: async (response) => {},
    onError: (error) => {},
  });

  return signInMutation;
};
