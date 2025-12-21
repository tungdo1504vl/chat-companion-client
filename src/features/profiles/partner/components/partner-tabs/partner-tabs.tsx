'use client';

import { cn } from '@/libs/tailwind/utils';
import { Button } from '@/components/ui/button';

export type PartnerTab = 'Overview' | 'Insights History';

interface PartnerTabsProps {
  activeTab: PartnerTab;
  onTabChange: (tab: PartnerTab) => void;
  className?: string;
}

export function PartnerTabs({
  activeTab,
  onTabChange,
  className,
}: PartnerTabsProps) {
  const tabs: PartnerTab[] = ['Overview', 'Insights History'];

  return (
    <div
      className={cn(
        'flex gap-1 border-b',
        className
      )}
    >
      {tabs.map((tab) => (
        <Button
          key={tab}
          variant="ghost"
          onClick={() => onTabChange(tab)}
          className={cn(
            'rounded-none border-b-2 border-transparent px-4 py-2 font-medium',
            'hover:bg-transparent hover:text-primary',
            activeTab === tab &&
              'border-primary text-primary bg-transparent hover:bg-transparent'
          )}
        >
          {tab}
        </Button>
      ))}
    </div>
  );
}

