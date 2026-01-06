import { TInputArgs, TTaskType } from '@/types/common';

export function createTaskParams(
  taskType: TTaskType,
  inputArgs: TInputArgs,
  priority?: string
) {
  return {
    task_type: taskType,
    input_args: inputArgs,
    priority: priority || 'high',
  };
}
