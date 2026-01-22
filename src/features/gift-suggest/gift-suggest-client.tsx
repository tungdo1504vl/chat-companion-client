'use client';

import { useState } from 'react';
import type { PartnerProfile } from '@/features/profile/partner/types';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/commons/page-header';
import { RadioGroup, RadioGroupItem } from '@/components/commons/radio-group';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Sparkles,
  Bell,
  ChevronDown,
  Gem,
  Flower2,
  Snowflake,
  SlidersHorizontal,
} from 'lucide-react';
import { cn } from '@/libs/tailwind/utils';

type GiftSuggestClientProps = Readonly<{
  partnerProfile: PartnerProfile;
}>;

type Occasion = 'just-because' | 'birthday' | 'valentines';
type PriceRange = '20-30' | '30-50' | '50-100' | 'flexible';

const GIFT_ICON_COLOR = ['#8b98ae', '#f27b8a', '#7781f0'];
const GIFT_ICON_BG = ['#f7f9fb', '#fbf1f7', '#ecf0fe'];

const occasionOptions = [
  { value: 'just-because' as const, label: 'Just Because' },
  { value: 'birthday' as const, label: 'Birthday' },
  { value: 'valentines' as const, label: "Valentine's" },
];

const priceRangeOptions = [
  { value: '20-30' as const, label: '$20-30' },
  { value: '30-50' as const, label: '$30-50' },
  { value: '50-100' as const, label: '$50-100' },
  { value: 'flexible' as const, label: 'Flexible' },
];

const giftIdeas = [
  {
    id: '1',
    title: 'Minimal Jewelry (Necklace)',
    icon: Gem,
    badge: 'TOP MATCH',
    badgeColor: 'text-romantic-400',
    quote: 'Timeless silver piece that she can wear daily.',
    details: {
      match: { label: 'MATCH', value: 'High (98%)' },
      impression: { label: 'IMPRESSION', value: 'Elegant' },
      budget: { label: 'BUDGET', value: '$$ Moderate' },
      risk: { label: 'RISK', value: '• Very Safe', isSafe: true },
    },
    analysis: {
      title: 'Why it works',
      description:
        'It matches her minimalist aesthetic perfectly. A silver necklace is intimate enough for a birthday but not overwhelming.',
    },
    showAnalysis: true,
  },
  {
    id: '2',
    title: 'Letter + Flower Box',
    icon: Flower2,
    badge: 'ROMANTIC PICK',
    badgeColor: 'text-romantic-400',
    quote: 'A deeply personal gesture combined with simple beauty.',
    details: {
      impression: { label: 'IMPRESSION', value: 'Romantic' },
      risk: { label: 'RISK', value: '• Slightly Bold', isSafe: false },
    },
    showAnalysis: false,
  },
  {
    id: '3',
    title: 'Soft Scarf / Hair Accessory',
    icon: Snowflake,
    badge: 'PRACTICAL CHOICE',
    badgeColor: 'text-muted-foreground',
    quote: 'Cozy, practical, and fits her gentle style.',
    details: {
      impression: { label: 'IMPRESSION', value: 'Cozy' },
      risk: { label: 'RISK', value: '• Very Safe', isSafe: true },
    },
    showAnalysis: false,
  },
];

export function GiftSuggestClient({ partnerProfile }: GiftSuggestClientProps) {
  const router = useRouter();
  const [occasion, setOccasion] = useState<Occasion>('birthday');
  const [priceRange, setPriceRange] = useState<PriceRange>('30-50');

  const avatarUrl =
    partnerProfile?.avatarUrl || '/images/placeholder-avatar.png';
  const partnerName = partnerProfile?.name || 'Her';
  const initials = partnerName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-stone-50 pb-32">
      {/* Header */}
      <PageHeader
        title=""
        onBackClick={() => router.back()}
        className="px-6 pt-4"
      />
      {/* Body */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <Avatar className="size-16 border-2 border-white shadow-md">
              <AvatarImage
                src={avatarUrl}
                alt={partnerName}
                className="object-cover"
              />
              <AvatarFallback className="bg-romantic-100 text-romantic-600">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
              <Heart className="size-4 text-romantic-400 fill-romantic-400" />
            </div>
          </div>
        </div>

        {/* Title and Subtitle */}
        <div className="space-y-2 mb-6">
          <h1 className="text-3xl font-sans font-bold text-foreground">
            Birthday Gift for Her
          </h1>
          <p className="text-sm text-muted-foreground">
            Something meaningful, just for her birthday.
          </p>
        </div>

        {/* Occasion Filter */}
        <div className="mb-4">
          <RadioGroup
            value={occasion}
            onValueChange={(value) => setOccasion(value as Occasion)}
            className="flex gap-1 flex-wrap"
          >
            {occasionOptions.map((option) => (
              <RadioGroupItem
                key={option.value}
                value={option.value}
                theme="darken"
              >
                {option.label}
              </RadioGroupItem>
            ))}
          </RadioGroup>
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <RadioGroup
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as PriceRange)}
            className="flex gap-2 flex-wrap"
          >
            {priceRangeOptions.map((option) => (
              <RadioGroupItem
                key={option.value}
                value={option.value}
                theme="light"
              >
                {option.label}
              </RadioGroupItem>
            ))}
          </RadioGroup>
        </div>
      </div>

      {/* Insight Box */}
      <div className="px-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4 flex items-start gap-3">
          <div className="bg-romantic-100 p-2 rounded-full shrink-0">
            <Sparkles className="size-5 text-romantic-400" />
          </div>

          <p className="text-sm text-foreground leading-relaxed">
            She has a gentle, feminine style... Simple, meaningful gifts suit
            her more than flashy surprises.
          </p>
        </div>
      </div>

      {/* Gift Ideas */}
      <div className="px-6 space-y-4 mb-6">
        {giftIdeas.map((gift, idx) => {
          const Icon = gift.icon;
          return (
            <div key={gift.id} className="bg-white rounded-lg p-5 shadow-sm">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-foreground">
                      {gift.title}
                    </h3>
                    <div
                      className="p-2 rounded-full"
                      style={{
                        backgroundColor: GIFT_ICON_BG[idx % 3] || '#f7f9fb',
                      }}
                    >
                      <Icon
                        className="size-4"
                        style={{
                          color: GIFT_ICON_COLOR[idx % 3] || '#8b98ae',
                        }}
                      />
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs font-medium border-0 px-0 py-0 h-auto',
                      gift.badgeColor,
                    )}
                  >
                    {gift.badge === 'TOP MATCH' && (
                      <Heart className="size-3 mr-1 fill-current" />
                    )}
                    {gift.badge}
                  </Badge>
                </div>
              </div>

              {/* Quote */}
              <p className="text-sm  text-muted-foreground mb-4 border-[#f5cbe3] border-l-2 pl-2">
                {'"'}
                {gift.quote}
                {'"'}
              </p>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {Object.entries(gift.details).map(([key, detail]) => (
                  <div key={key} className="rounded-lg bg-gray-50 p-2">
                    <div className="text-xs font-medium text-muted-foreground mb-1">
                      {detail.label}
                    </div>
                    <div
                      className={cn(
                        'text-sm font-medium',
                        detail.isSafe !== undefined
                          ? detail.isSafe
                            ? 'text-green-600'
                            : 'text-orange-600'
                          : 'text-foreground',
                      )}
                    >
                      {detail.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Analysis */}
              {gift.showAnalysis && gift.analysis && (
                <div className="border border-gray-200 rounded-lg p-3 bg-gray-100 pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="size-4 text-romantic-400" />
                    <span className="text-xs font-semibold text-foreground">
                      ANALYSIS
                    </span>
                  </div>
                  <div className="text-xs font-bold text-black mb-2">
                    {gift.analysis.title}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {gift.analysis.description}
                  </p>
                </div>
              )}

              {/* See Analysis Link */}
              {!gift.showAnalysis && (
                <div className="flex justify-center">
                  <button className="flex items-center gap-1 text-sm text-romantic-400 hover:underline">
                    See Analysis
                    <ChevronDown className="size-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Notification Box */}
      <div className="px-6 pb-[120px]">
        <div className="bg-white rounded-lg shadow-md p-4 flex items-start gap-3">
          <Bell className="size-5 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-foreground mb-1">
              Notify me if better ideas appear
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We'll let you know if a more suitable birthday gift comes up
              closer to her birthday.
            </p>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
        <Button
          className="w-full flex flex-col items-center h-16 bg-[#1d2433] hover:bg-slate-800 text-white mb-2"
          size="lg"
        >
          <div className="flex gap-2 items-center">
            <SlidersHorizontal className="size-5" />
            <p>Refine Gifts for Her</p>
          </div>
          <p className="text-xs text-center text-white/80">
            Adjust budget, tone, or how bold you want to be
          </p>
        </Button>
      </div>
    </div>
  );
}
