// hooks/use-match-pathname.ts
'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

/**
 * Converts a pathname pattern (e.g., "/partners/:id/plan-a-day") to a regex
 * @param pattern - Pathname pattern with dynamic segments like :id, :slug, etc.
 * @param paramPatterns - Optional custom patterns for dynamic segments (default: matches any non-slash characters)
 * @returns RegExp that matches the pattern
 */
function patternToRegex(
  pattern: string,
  paramPatterns?: Record<string, string>,
): RegExp {
  // Default pattern for dynamic segments (matches any non-slash characters)
  const defaultParamPattern = '[^/]+';
  
  // Split pattern into segments by '/'
  const segments = pattern.split('/').filter(Boolean);
  
  // Process each segment
  const regexSegments = segments.map((segment) => {
    // Check if segment is a dynamic parameter (starts with :)
    if (segment.startsWith(':')) {
      const paramName = segment.slice(1); // Remove the ':'
      const paramPattern = paramPatterns?.[paramName] || defaultParamPattern;
      return `(${paramPattern})`;
    }
    // Static segment: escape special regex characters
    return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  });

  // Join segments with '/' and anchor to start and end
  const regexString = `^/${regexSegments.join('/')}$`;

  return new RegExp(regexString, 'i');
}

/**
 * Hook to check if the current pathname matches a given pattern
 * @param pattern - Pathname pattern with dynamic segments (e.g., "/partners/:id/plan-a-day")
 * @param paramPatterns - Optional custom patterns for dynamic segments
 * @example
 * ```tsx
 * // Match "/partners/:id/plan-a-day" where :id is a 32-char hex string
 * const isPlanADay = useMatchPathname('/partners/:id/plan-a-day', {
 *   id: '[a-f0-9]{32}'
 * });
 * 
 * // Match any "/partners/:id/plan-a-day"
 * const isPlanADay = useMatchPathname('/partners/:id/plan-a-day');
 * ```
 */
export function useMatchPathname(
  pattern: string,
  paramPatterns?: Record<string, string>,
): boolean {
  const pathname = usePathname();

  const regex = useMemo(
    () => patternToRegex(pattern, paramPatterns),
    [pattern, paramPatterns],
  );

  return regex.test(pathname);
}

