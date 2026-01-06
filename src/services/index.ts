/**
 * Centralized service exports
 * Provides easy access to all services, types, and utilities
 */

// Types
export type {
  TCommonPayload,
  TCommonResponse,
  TOnboardingPayload,
  TTaskType,
  TTaskStatus,
  TTaskInputArgs,
} from "./types";

// Base service utilities
export { createTaskRequest } from "./base.service";

// Services
export { default as userService } from "./user.service";
