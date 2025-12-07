import {
  defaultShouldDehydrateQuery,
  isServer,
  QueryClient,
  dehydrate as tanstackDehydrate,
  HydrationBoundary as TanstackHydrationBoundary,
  useInfiniteQuery as tanstackUseInfiniteQuery,
  useMutation as tanstackUseMutation,
  useQueries as tanstackUseQueries,
  useQuery as tanstackUseQuery,
  useQueryClient as tanstackUseQueryClient,
} from "@tanstack/react-query";

const useQuery = tanstackUseQuery;
const useQueries = tanstackUseQueries;
const useMutation = tanstackUseMutation;
const useQueryClient = tanstackUseQueryClient;
const useInfiniteQuery = tanstackUseInfiniteQuery;
const dehydrate = tanstackDehydrate;
const HydrationBoundary = TanstackHydrationBoundary;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      // queries: {
      //   staleTime: 60 * 1000,
      // },
      dehydrate: {
        // include pending queries in dehydration
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      mutations: {
        retry: 0,
      },
      queries: {
        retry: 0,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export {
  useQuery,
  useQueries,
  useQueryClient,
  useMutation,
  useInfiniteQuery,
  dehydrate,
  HydrationBoundary,
  getQueryClient,
};
export type { InfiniteData } from "@tanstack/react-query";
