import { createTaskRequest } from "./base.service";
import { TCommonPayload, TCommonResponse, TOnboardingPayload } from "./types";

/**
 * User service
 * Maintains backward compatibility with existing methods
 */
const userService = {
  /**
   * Submit a task for processing
   */
  submit(payload: TOnboardingPayload): Promise<TCommonResponse> {
    return createTaskRequest(
      payload.task_type,
      payload.input_args,
      payload.priority,
      "/internal/v1/tasks/submit"
    );
  },

  /**
   * Compute a task
   */
  compute(payload: TCommonPayload): Promise<TCommonResponse> {
    return createTaskRequest(
      payload.task_type,
      payload.input_args,
      payload.priority,
      "/internal/v1/tasks/compute"
    );
  },

  /**
   * Stream a task
   */
  stream(payload: TCommonPayload): Promise<TCommonResponse> {
    return createTaskRequest(
      payload.task_type,
      payload.input_args,
      payload.priority,
      "/internal/v1/tasks/stream"
    );
  },
};

export default userService;
