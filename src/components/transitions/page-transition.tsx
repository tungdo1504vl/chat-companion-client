'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { PropsWithChildren, useEffect, useState } from 'react';

interface PageTransitionProps extends PropsWithChildren {
  /**
   * Transition variant: 'fade', 'slide', 'fadeSlide'
   * Default: 'fadeSlide'
   */
  variant?: 'fade' | 'slide' | 'fadeSlide';
  /**
   * Transition duration in milliseconds
   * Default: 200
   */
  duration?: number;
}

const transitionVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, x: 8 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -8 },
  },
  fadeSlide: {
    initial: { opacity: 0, y: 4 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -4 },
  },
};

/**
 * PageTransition component provides smooth page transitions
 * Uses CSS transforms for performance, with framer-motion for orchestration
 * Respects prefers-reduced-motion
 */
export function PageTransition({
  children,
  variant = 'fadeSlide',
  duration = 200,
}: PageTransitionProps) {
  const pathname = usePathname();
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const variantConfig = transitionVariants[variant];

  // If reduced motion is preferred, disable animations
  if (isReducedMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={variantConfig.initial}
        animate={variantConfig.animate}
        exit={variantConfig.exit}
        transition={{
          duration: duration / 1000, // Convert to seconds
          ease: [0.4, 0, 0.2, 1], // ease-out cubic bezier (matches CSS ease-out)
          opacity: { duration: duration / 1000 },
        }}
        style={{
          // Use CSS transforms for hardware acceleration
          // Framer Motion will handle willChange automatically
        }}
        className="page-transition-wrapper"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
