'use client';

import { cn } from '@/libs/tailwind/utils';
import { Calendar, Gift, Map, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

type ActionButton = {
  id: string;
  label: string;
  icon: React.ReactNode;
  link?: string;
  isUpcoming?: boolean;
};

const ACTION_BUTTONS: ActionButton[] = [
  {
    id: 'plan-date',
    label: 'Plan a date',
    icon: <Map />,
    link: '/plan-a-day',
  },
  {
    id: 'suggest-gift',
    label: 'Suggest a small gift',
    icon: <Gift />,
    link: '/gift-suggest',
  },
  { id: 'ask-out', label: 'Ask her out', icon: <Calendar />, isUpcoming: true },
  {
    id: 'find-places',
    label: 'Find date places',
    icon: <MapPin />,
    isUpcoming: true,
  },
] as const;

export function AlternativeActionsSection({
  partnerId,
}: {
  partnerId: string;
}) {
  const router = useRouter();
  const handleActionClick = (link?: string) => {
    if (link) {
      router.push(`/partners/${partnerId}${link}`);
    }
  };

  return (
    <section className="pl-8 mb-12">
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
        If you want to take it slower...
      </h3>
      <div className="flex pb-1 pt-2 gap-3 overflow-x-auto hide-scrollbar pr-8">
        {ACTION_BUTTONS.map((button) => (
          <button
            key={button.id}
            onClick={() => handleActionClick(button.link)}
            className={cn(
              'relative shrink-0 flex items-center gap-2 bg-white/60 border border-romantic-100/50 px-5 py-3 rounded-2xl shadow-sm hover:bg-white transition-colors',
              {
                'cursor-pointer': Boolean(button.link),
              },
            )}
          >
            {button.isUpcoming && (
              <Badge
                variant="secondary"
                className="absolute shadow -top-2 -right-2 text-[10px] px-1.5 py-0.5 bg-romantic-400 text-white border-0"
              >
                Upcoming
              </Badge>
            )}
            <span className="material-symbols-outlined text-lg text-romantic-400">
              {button.icon}
            </span>
            <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">
              {button.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
