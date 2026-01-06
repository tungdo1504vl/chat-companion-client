import { useMutation } from '@/libs/react-query';
import commonService from '@/services/common.service';
import { TCommonPayload } from '@/types/common';

export const useCommonCompute = () => {
  const commonMutation = useMutation({
    mutationFn: async (data: TCommonPayload) => {
      return await commonService.compute(data);
    },
    onSuccess: async (response) => {},
    onError: (error) => {},
  });

  return commonMutation;
};
