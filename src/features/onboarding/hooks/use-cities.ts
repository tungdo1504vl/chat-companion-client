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
  enabled?: boolean;
}

export const useCities = ({
  country,
  query,
  limit = 50,
  enabled = true,
}: UseCitiesParams) => {
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

      // Remove duplicate cities using Set
      const uniqueCities = Array.from(
        new Set(response.result.cities?.filter(Boolean))
      );

      return uniqueCities.map((city): ComboboxOption => {
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
    enabled: Boolean(
      enabled && country && userId
      // Allow fetching even with empty query to show initial cities
    ),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  return {
    data: data ?? [],
    isLoading,
    error,
  };
};
