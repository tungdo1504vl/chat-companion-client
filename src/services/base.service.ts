import axiosClient from "@/libs/axios";
import { TCommonPayload, TCommonResponse, TTaskType } from "./types";

/**
 * Default endpoint for task submission
 */
const DEFAULT_ENDPOINT = "/internal/v1/tasks/submit";

/**
 * Creates a task request to the backend
 *
 * @param taskType - The type of task to execute (e.g., 'partner_profile_create', 'user_profile_validate')
 * @param inputArgs - Task-specific input arguments
 * @param priority - Priority level for the task
 * @param endpoint - Optional custom endpoint (defaults to '/internal/v1/tasks/submit')
 * @returns Promise resolving to the task response
 */
export function createTaskRequest<TResult = unknown>(
  taskType: TTaskType,
  inputArgs: Record<string, string | number>,
  priority: string,
  endpoint: string = DEFAULT_ENDPOINT
): Promise<TCommonResponse<TResult>> {
  const payload: TCommonPayload = {
    task_type: taskType,
    input_args: inputArgs,
    priority,
  };

  // axiosClient interceptor returns response.data, so the return type is TCommonResponse
  return axiosClient.post(endpoint, payload);
}
