import { TASK_TYPE } from '@/constants/task';

export type TTaskType = (typeof TASK_TYPE)[keyof typeof TASK_TYPE];

export interface TCommonPayload {
  priority: string;
  task_type: TTaskType;
  input_args: TObject;
}
// type TObject = { [key: string]: unknown };

type TObject = {
  [key: string]: TObject | TObject[] | string | number | string[] | boolean;
};

export type TInputArgs = TObject;
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
