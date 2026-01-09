import { TInputArgs, TTaskType } from '@/types/common';

export function createTaskParams(
  taskType: TTaskType,
  inputArgs: TInputArgs,
  priority?: string,
  options?: {
    enable?: boolean;
  }
) {
  return {
    task_type: taskType,
    input_args: inputArgs,
    priority: priority || 'high',
  };
}

export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
