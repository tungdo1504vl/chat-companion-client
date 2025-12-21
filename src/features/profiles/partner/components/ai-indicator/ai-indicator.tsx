'use client';

import { Sparkles } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/libs/tailwind/utils';

interface AiIndicatorProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AiIndicator({ className, size = 'md' }: AiIndicatorProps) {
  const sizeClasses = {
    sm: 'size-3',
    md: 'size-4',
    lg: 'size-5',
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            'inline-flex items-center justify-center text-primary cursor-help',
            sizeClasses[size],
            className
          )}
        >
          <Sparkles className="size-full" />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs">
          AI-inferred based on public social content.
          <br />
          Accuracy may vary. You can edit or confirm.
        </p>
      </TooltipContent>
    </Tooltip>
  );
}

