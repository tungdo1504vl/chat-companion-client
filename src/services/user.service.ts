import axiosClient from '@/libs/axios';

export interface TCommonPayload {
  priority: string;
  task_type: string;
  input_args: { [key: string]: string | number };
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TOnboardingPayload extends TCommonPayload {}

export interface TCommonResponse {
  metadata: { [key: string]: string | number };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: any;
  task_type: string;
  task_id: string;
  status: string;
}

/**
 * User service
 */
const userService = {
  submit(payload: TOnboardingPayload): Promise<TCommonResponse> {
    return axiosClient.post('/internal/v1/tasks/submit', payload);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  compute(payload: TCommonPayload): Promise<TCommonResponse> {
    return axiosClient.post('/internal/v1/tasks/compute', payload);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stream(payload: TCommonPayload): Promise<TCommonResponse> {
    return axiosClient.post('/internal/v1/tasks/stream', payload);
  },
};

export default userService;
