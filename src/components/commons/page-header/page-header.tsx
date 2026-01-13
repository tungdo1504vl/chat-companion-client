'use client';

import { ArrowLeft, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { TypographyH1 } from '@/components/ui/typgoraphy';
import { TPageHeaderProps } from './types';
import { cn } from '@/libs/tailwind/utils';

export default function PageHeader({
  title,
  onBackClick,
  backHref,
  onMenuClick,
  className,
}: TPageHeaderProps) {
  const backButtonClassName =
    'w-10 h-10 flex items-center justify-center shadow-md rounded-full bg-white/60 backdrop-blur-md border border-white/50';

  return (
    <nav
      className={cn(
        'px-6 pt-4 pb-2 flex items-center justify-between',
        className
      )}
    >
      {backHref ? (
        <Link href={backHref} className={backButtonClassName}>
          <ArrowLeft className="material-symbols-outlined  text-romantic-400 text-xl" />
        </Link>
      ) : onBackClick ? (
        <button
          type="button"
          className={backButtonClassName}
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
