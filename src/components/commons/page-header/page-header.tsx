'use client';

import { ArrowLeft, MoreVertical } from 'lucide-react';
import { TypographyH1, TypographyH2 } from '@/components/ui/typgoraphy';
import { TPageHeaderProps } from './types';
import { cn } from '@/libs/tailwind/utils';

export default function PageHeader({
  title,
  onBackClick,
  onMenuClick,
  className,
}: TPageHeaderProps) {
  return (
    <nav
      className={cn(
        'px-6 pt-4 pb-2 flex items-center justify-between',
        className
      )}
    >
      {onBackClick ? (
        <button
          type="button"
          className="min-w-10 w-10 h-10 flex items-center justify-center shadow-md rounded-full bg-white/60 backdrop-blur-md border border-white/50"
          onClick={onBackClick}
        >
          <ArrowLeft className="material-symbols-outlined  text-romantic-400 text-xl" />
        </button>
      ) : (
        <div className="w-10 h-10" />
      )}
      {title && (
        <TypographyH1 className="text-2xl font-bold text-center">
          {title}
        </TypographyH1>
      )}
      {onMenuClick ? (
        <button
          type="button"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-sm border border-white/50"
          onClick={onMenuClick}
        >
          <MoreVertical className="material-symbols-outlined text-romantic-400 text-xl" />
        </button>
      ) : (
        <div className="w-10 h-10" />
      )}
    </nav>
  );
}
