import { useQuery } from "@/libs/react-query";
import { useSession } from "@/libs/better-auth/client";
import { userService } from "@/services";
import type { ComboboxOption } from "@/components/ui/combobox";

interface CityResponse {
  cities?: string[];
  [key: string]: unknown;
}

interface UseCitiesParams {
  country: string;
  query: string;
  limit?: number;
}

export const useCities = ({ country, query, limit = 50 }: UseCitiesParams) => {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "";

  const { data, isLoading, error } = useQuery({
    queryKey: ["cities", country, query, limit, userId],
    queryFn: async () => {
      const response = await userService.getLocations<CityResponse>({
        user_id: userId,
        country,
        query,
        limit,
      });

      // Transform response result to ComboboxOption format
      if (!response.result) {
        return [];
      }

      return response.result.cities?.map((city): ComboboxOption => {
        // Handle different possible response formats
        const value = city;
        const label = city;

        return {
          id: crypto.randomUUID(),
          value,
          label,
        };
      });
    },
    enabled: Boolean(country && userId), // Only fetch when country and userId are available
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  return {
    data: data ?? [],
    isLoading,
    error,
  };
};
