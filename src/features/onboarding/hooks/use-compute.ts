import { useMutation } from '@/libs/react-query';
import { userService, TCommonPayload } from '@/services';

/**
 * Generic compute hook
 * Note: This hook accepts a TCommonPayload but you should use specific service methods
 * (e.g., userService.analyzeUserProfile) instead when possible for better type safety
 */
export const useCompute = () => {
  const computeMutation = useMutation({
    mutationFn: async (data: TCommonPayload) => {
      // Map task_type to appropriate service method
      // For now, using a generic approach - consider using specific methods instead
      switch (data.task_type) {
        case 'user_profile_analyze':
          return await userService.analyzeUserProfile(data.input_args, data.priority);
        case 'user_profile_validate':
          return await userService.validateUserProfile(data.input_args, data.priority);
        case 'user_profile_get':
          return await userService.getUserProfile(data.input_args, data.priority);
        case 'user_profile_update':
          return await userService.updateUserProfile(data.input_args, data.priority);
        default:
          // Fallback: This should be replaced with specific service methods
          throw new Error(`Unsupported task type: ${data.task_type}. Use specific service methods instead.`);
      }
    },
    onSuccess: async (response) => {},
    onError: (error) => {},
  });

  return computeMutation;
};
