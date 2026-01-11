import axiosClient from "@/libs/axios";
import { TCommonPayload } from "@/types/common";
import { createTaskRequest } from "./base.service";
import { TCommonResponse, TTaskInputArgs, TTaskType } from "./types";

/**
 * Default endpoint for task submission
 */
const DEFAULT_ENDPOINT = "/internal/v1/tasks/compute";

/**
 * Helper function to create a task request with default endpoint
 * Keeps code DRY and makes it easy to change endpoint pattern in the future
 */
const createTask = <TResult = unknown>(
  taskType: TTaskType,
  inputArgs: TTaskInputArgs,
  priority: string = "medium"
): Promise<TCommonResponse<TResult>> => {
  return createTaskRequest<TResult>(
    taskType,
    inputArgs,
    priority,
    DEFAULT_ENDPOINT
  );
};

/**
 * User service
 * Provides type-safe functions for each task type
 */
const userService = {
  // ============================================
  // Partner Profile Functions
  // ============================================

  /**
   * Get a partner profile by ID
   */
  getPartnerProfile<TResult = unknown>(
    inputArgs: TTaskInputArgs,
    priority: string = "medium"
  ): Promise<TCommonResponse<TResult>> {
    return createTask<TResult>("partner_profile_get", inputArgs, priority);
  },
  compute(payload: TCommonPayload): Promise<TCommonResponse> {
    return axiosClient.post("/internal/v1/tasks/compute", payload);
  },
  stream(payload: TCommonPayload): Promise<TCommonResponse> {
    return axiosClient.post("/internal/v1/tasks/stream", payload);
  },
  /**
   * List all partner profiles
   */
  listPartnerProfiles<TResult = unknown>(
    inputArgs: TTaskInputArgs,
    priority: string = "medium"
  ): Promise<TCommonResponse<TResult>> {
    return createTask<TResult>("partner_profile_list", inputArgs, priority);
  },

  /**
   * Create a new partner profile
   */
  createPartnerProfile<TResult = unknown>(
    inputArgs: TTaskInputArgs,
    priority: string = "medium"
  ): Promise<TCommonResponse<TResult>> {
    return createTask<TResult>("partner_profile_create", inputArgs, priority);
  },

  /**
   * Get insights for a partner profile
   */
  getPartnerProfileInsights<TResult = unknown>(
    inputArgs: TTaskInputArgs,
    priority: string = "medium"
  ): Promise<TCommonResponse<TResult>> {
    return createTask<TResult>("partner_profile_insights", inputArgs, priority);
  },

  /**
   * List partner insights
   */
  listPartnerInsights<TResult = unknown>(
    inputArgs: TTaskInputArgs,
    priority: string = "medium"
  ): Promise<TCommonResponse<TResult>> {
    return createTask<TResult>("partner_insights_list", inputArgs, priority);
  },

  /**
   * Get gift ideas for a partner
   */
  getPartnerGiftIdeas<TResult = unknown>(
    inputArgs: TTaskInputArgs,
    priority: string = "medium"
  ): Promise<TCommonResponse<TResult>> {
    return createTask<TResult>("partner_gift_ideas", inputArgs, priority);
  },

  // ============================================
  // User Profile Functions
  // ============================================

  /**
   * Get user profile
   */
  getUserProfile<TResult = unknown>(
    inputArgs: TTaskInputArgs,
    priority: string = "medium"
  ): Promise<TCommonResponse<TResult>> {
    return createTask<TResult>("user_profile_get", inputArgs, priority);
  },

  /**
   * Update user profile
   */
  updateUserProfile<TResult = unknown>(
    inputArgs: TTaskInputArgs,
    priority: string = "medium"
  ): Promise<TCommonResponse<TResult>> {
    return createTask<TResult>("user_profile_update", inputArgs, priority);
  },

  /**
   * Validate user profile data
   */
  validateUserProfile<TResult = unknown>(
    inputArgs: TTaskInputArgs,
    priority: string = "medium"
  ): Promise<TCommonResponse<TResult>> {
    return createTask<TResult>("user_profile_validate", inputArgs, priority);
  },

  /**
   * Analyze user profile
   */
  analyzeUserProfile<TResult = unknown>(
    inputArgs: TTaskInputArgs,
    priority: string = "medium"
  ): Promise<TCommonResponse<TResult>> {
    return createTask<TResult>("user_profile_analyze", inputArgs, priority);
  },

  /**
   * Get locations
   */
  getLocations<TResult = unknown>(
    inputArgs: TTaskInputArgs,
    priority: string = "medium"
  ): Promise<TCommonResponse<TResult>> {
    return createTask<TResult>("location_city_list", inputArgs, priority);
  },
};

export default userService;
