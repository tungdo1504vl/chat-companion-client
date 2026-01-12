'use client';

import {
  Gift,
  Plus,
  Camera,
  Mountain,
  Coffee,
  BookOpen,
  SparklesIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ContentCard from '@/features/profile/common/content-card/content-card';
import type { GiftIdea } from '../../types';
import { cn } from '@/libs/tailwind/utils';

interface SmartGiftIdeasSectionProps {
  giftIdeas?: GiftIdea[];
  hobbies?: string[];
  className?: string;
  onGenerateGiftIdeas?: () => void;
}

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Camera,
  Mountain,
  Coffee,
  BookOpen,
};

export function SmartGiftIdeasSection({
  giftIdeas = [],
  hobbies = [],
  className,
  onGenerateGiftIdeas,
}: SmartGiftIdeasSectionProps) {
  const hobbiesText =
    hobbies.length > 0
      ? hobbies.slice(0, 3).join(', ') + (hobbies.length > 3 ? ' & more' : '')
      : 'their interests';
  return (
    <ContentCard className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Gift className="size-5 text-muted-foreground" />
          <h3 className="text-base font-bold">Smart Gift Ideas</h3>
        </div>
        <Badge variant="outline" className="text-xs">
          <SparklesIcon className="size-5 text-primary" />{' '}
          <span className="text-primary">AI CURATED</span>
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Suggestions based on {hobbiesText}.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {giftIdeas.map((gift) => {
          const IconComponent = iconMap[gift.icon] || Gift;

          return (
            <div
              key={gift.id}
              className={cn(
                'rounded-lg p-3 flex flex-col gap-2',
                gift.iconColor
              )}
            >
              <div className="flex items-start justify-between">
                <IconComponent
                  className={cn('size-5', getIconColorClass(gift.iconColor))}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium truncate">
                  {gift.name}
                </span>
                <span className="text-sm font-semibold">
                  ${gift.price.toFixed(2)}
                </span>
                <Badge variant="outline" className="text-xs w-fit">
                  {gift.tag}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={onGenerateGiftIdeas}
      >
        <Plus className="size-4 mr-2" />
        Generate More Ideas
      </Button>
    </ContentCard>
  );
}

// Helper function to get appropriate icon color based on background
function getIconColorClass(bgColor: string): string {
  if (bgColor.includes('orange')) return 'text-orange-600';
  if (bgColor.includes('green')) return 'text-green-600';
  if (bgColor.includes('amber')) return 'text-amber-600';
  if (bgColor.includes('purple')) return 'text-purple-600';
  if (bgColor.includes('pink')) return 'text-pink-600';
  if (bgColor.includes('red')) return 'text-red-600';
  return 'text-foreground';
}
