import axiosClient from '@/libs/axios';
import {
  TOnboardingPayload,
  TCommonResponse,
  TCommonPayload,
} from '@/types/common';

/**
 * User service
 */
const commonService = {
  submit(payload: TOnboardingPayload): Promise<TCommonResponse> {
    return axiosClient.post('/internal/v1/tasks/submit', payload);
  },
  compute(payload: TCommonPayload): Promise<TCommonResponse> {
    return axiosClient.post('/internal/v1/tasks/compute', payload);
  },
  stream(payload: TCommonPayload): Promise<TCommonResponse> {
    return axiosClient.post('/internal/v1/tasks/stream', payload);
  },
};

export default commonService;
