import commonService from '@/services/common.service';
import { TCommonPayload } from '@/types/common';
import { useQuery } from '@tanstack/react-query';

export const useComputeGet = (params: TCommonPayload) => {
  return useQuery({
    queryKey: ['compute', params.task_type],
    queryFn: () => {
      return commonService.compute(params);
    },
    enabled: Boolean(params.task_type) && Boolean(params.input_args.user_id),
    staleTime: 5 * 60 * 1000,
  });
};
