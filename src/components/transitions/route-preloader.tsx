'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * RoutePreloader component preloads routes on hover/touch
 * Improves perceived performance by prefetching pages
 */
export function RoutePreloader({ href }: { href: string }) {
  const router = useRouter();
  const preloadedRef = useRef(false);

  useEffect(() => {
    // Preload route immediately on mount for critical paths
    if (!preloadedRef.current) {
      router.prefetch(href);
      preloadedRef.current = true;
    }
  }, [href, router]);

  return null;
}

/**
 * Hook to preload routes on hover/touch
 * Usage: <Link href="/path" onMouseEnter={() => preloadRoute('/path')}>
 */
export function useRoutePreloader() {
  const router = useRouter();
  const preloadedRoutes = useRef<Set<string>>(new Set());

  const preloadRoute = (href: string) => {
    if (!preloadedRoutes.current.has(href)) {
      router.prefetch(href);
      preloadedRoutes.current.add(href);
    }
  };

  return { preloadRoute };
}
