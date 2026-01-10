import commonService from '@/services/common.service';
import { TCommonPayload } from '@/types/common';
import { useQuery } from '@tanstack/react-query';

export interface TUseComputeGetOptions {
  enabled?: boolean;
  queryKeys?: string[];
}

export const useComputeGet = (
  params: TCommonPayload,
  options?: TUseComputeGetOptions
) => {
  const { enabled, queryKeys = [] } = options || {};
  const enableInternal = params.input_args.user_id;
  const enableQuery = enabled || enableInternal;
  const externalQueryKey = queryKeys.length > 0 ? queryKeys : [''];
  return useQuery({
    queryKey: ['compute', params.task_type, ...externalQueryKey],
    queryFn: () => {
      return commonService.compute(params);
    },
    enabled: Boolean(params.task_type) && Boolean(enableQuery),
    staleTime: 5 * 60 * 1000,
  });
};
