export type TTaskType =
  | "generate_compatibility_insights"
  | "location_city_list"
  | "generate_natal_chart"
  | "partner_gift_ideas"
  | "partner_insights_list"
  | "partner_profile_insights"
  | "partner_profile_archive"
  | "partner_profile_create"
  | "partner_profile_get"
  | "partner_profile_list"
  | "partner_profile_update"
  | "partner_special_day_create"
  | "partner_special_day_delete"
  | "partner_special_day_update"
  | "partner_special_days_list"
  | "partner_voice_profile_create"
  | "partner_voice_synthesize"
  | "relationship_chat_sessions"
  | "relationship_chat"
  | "generate_relationship_insights"
  | "special_days_preview"
  | "user_profile_analyze"
  | "user_profile_get"
  | "user_profile_update"
  | "user_profile_validate";

export type TTaskInputArgs = { [key: string]: string | number };
export type TTaskStatus = "pending" | "running" | "completed" | "failed";

export interface TCommonPayload {
  priority: string;
  task_type: TTaskType;
  input_args: TTaskInputArgs;
}

/**
 * Common response structure from backend task requests
 * The result type depends on the task_type
 */
export interface TCommonResponse<TResult = unknown> {
  task_id: string;
  status: TTaskStatus;
  task_type: TTaskType;
  result: TResult;
}

/**
 * Extended payload for onboarding tasks
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TOnboardingPayload extends TCommonPayload {}
