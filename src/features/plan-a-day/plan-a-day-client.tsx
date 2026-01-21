'use client';

import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import type { PartnerProfile } from '@/features/profile/partner/types';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/commons/page-header';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/commons/radio-group';
import { Select } from '@/components/commons/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  MapPin,
  Lock,
  Coffee,
  Bell,
  IceCream,
  Check,
  DollarSign,
} from 'lucide-react';
import { cn } from '@/libs/tailwind/utils';

type PlanADayClientProps = Readonly<{
  partnerProfile: PartnerProfile;
}>;

type RelationshipStatus = 'just-getting-to-know' | 'friends';
type Vibe = 'relaxed' | 'romantic' | 'fun' | 'deep';
type Timing = 'morning' | 'afternoon' | 'evening';

interface PlanADayFormValues {
  location: string;
  relationshipStatus: RelationshipStatus;
  vibe: Vibe;
  timing: Timing;
  budget: number[];
}

const defaultValues: PlanADayFormValues = {
  location: 'Ho Chi Minh City',
  relationshipStatus: 'just-getting-to-know',
  vibe: 'relaxed',
  timing: 'evening',
  budget: [1250],
};

const relationshipStatusOptions = [
  {
    value: 'just-getting-to-know' as const,
    label: 'Just getting to know each other',
  },
  { value: 'friends' as const, label: 'Friends' },
];

const vibeOptions = [
  { value: 'relaxed' as const, label: 'Relaxed' },
  { value: 'romantic' as const, label: 'Romantic' },
  { value: 'fun' as const, label: 'Fun' },
  { value: 'deep' as const, label: 'Deep' },
];

const timingOptions = [
  { value: 'morning' as const, label: 'Morning' },
  { value: 'afternoon' as const, label: 'Afternoon' },
  { value: 'evening' as const, label: 'Evening' },
];

const locationOptions = [
  { value: 'Ho Chi Minh City', label: 'Ho Chi Minh City' },
  { value: 'Hanoi', label: 'Hanoi' },
  { value: 'Da Nang', label: 'Da Nang' },
  { value: 'Hue', label: 'Hue' },
];

const PlanTagBgColor = ['#fef6eb', '#f4f5fa'];
const PlanTagTextColor = ['#d95924i', '#7592e7'];

const suggestedPlans = [
  {
    id: '1',
    title: 'Evening Café + Quiet Walk',
    tag: 'WARM & SINCERE',
    isBestMatch: true,
    features: ['Matches her gentle personality', 'Low pressure, easy talking'],
  },
  {
    id: '2',
    title: 'Art & Dessert',
    tag: 'THOUGHTFUL',
    isBestMatch: false,
    features: ['Creative and sweet', 'Great conversation starter'],
  },
];

const dateFlow = [
  { step: 'MEET', title: 'Relaxed Café', icon: Coffee },
  { step: 'ACTIVITY', title: 'Short Walk in Park', icon: Bell },
  { step: 'END', title: 'Quiet Dessert', icon: IceCream },
];

function formatBudget(value: number): string {
  return `$${value.toLocaleString()}`;
}

export function PlanADayClient({ partnerProfile }: PlanADayClientProps) {
  const router = useRouter();
  const [budgetValue, setBudgetValue] = useState([1250]);

  const form = useForm({
    defaultValues,
  });

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleLockDatePlan = () => {
    const values = form.state.values;
    console.log('Lock date plan:', values);
    // TODO: Implement lock date plan logic
  };

  return (
    <div className="min-h-screen bg-romantic-50 pb-24">
      <PageHeader
        title="DATING ASSISTANT"
        onBackClick={() => router.back()}
        className="px-6 pt-4"
      />

      <main className="px-6 pt-6 pb-[140px] space-y-8">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Plan a Date with Her
          </h1>
          <p className="text-sm text-muted-foreground">
            Something that feels easy, natural, and just right for the two of
            you.
          </p>
        </div>

        {/* Tell me a bit about the date... Section */}
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-romantic-400" />
              <h2 className="text-base font-medium text-foreground">
                Tell me a bit about the date...
              </h2>
            </div>

            {/* Location */}
            <form.Field name="location">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel>LOCATION:</FieldLabel>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-romantic-400" />
                    <Select
                      value={field.state.value}
                      onValueChange={(value) => {
                        field.handleChange(value);
                        field.handleBlur();
                      }}
                      options={locationOptions}
                      placeholder="Select location"
                      triggerClassName="w-full pl-10 bg-romantic-50 border-romantic-200"
                    />
                  </div>
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </Field>
              )}
            </form.Field>

            {/* Where are you two at? */}
            <form.Field name="relationshipStatus">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel>WHERE ARE YOU TWO AT?:</FieldLabel>
                  <RadioGroup
                    value={field.state.value}
                    onValueChange={(value) => {
                      field.handleChange(value as RelationshipStatus);
                      field.handleBlur();
                    }}
                    className="flex gap-2 flex-wrap"
                  >
                    {relationshipStatusOptions.map((option) => (
                      <RadioGroupItem key={option.value} value={option.value}>
                        {option.label}
                      </RadioGroupItem>
                    ))}
                  </RadioGroup>
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </Field>
              )}
            </form.Field>

            {/* The Vibe */}
            <form.Field name="vibe">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel>THE VIBE:</FieldLabel>
                  <RadioGroup
                    value={field.state.value}
                    onValueChange={(value) => {
                      field.handleChange(value as Vibe);
                      field.handleBlur();
                    }}
                    className="flex gap-2 flex-wrap"
                  >
                    {vibeOptions.map((option) => (
                      <RadioGroupItem key={option.value} value={option.value}>
                        {option.label}
                      </RadioGroupItem>
                    ))}
                  </RadioGroup>
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </Field>
              )}
            </form.Field>

            {/* Timing */}
            <form.Field name="timing">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel>TIMING:</FieldLabel>
                  <RadioGroup
                    value={field.state.value}
                    onValueChange={(value) => {
                      field.handleChange(value as Timing);
                      field.handleBlur();
                    }}
                    className="flex gap-2 flex-wrap"
                  >
                    {timingOptions.map((option) => (
                      <RadioGroupItem key={option.value} value={option.value}>
                        {option.label}
                      </RadioGroupItem>
                    ))}
                  </RadioGroup>
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </Field>
              )}
            </form.Field>

            {/* Budget */}
            <form.Field name="budget">
              {(field) => (
                <Field className="flex flex-col gap-2">
                  <FieldLabel>BUDGET:</FieldLabel>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">$10</span>
                      <span className="text-base font-medium text-romantic-400">
                        {formatBudget(budgetValue[0])}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        $5,000
                      </span>
                    </div>
                    <Slider
                      value={budgetValue}
                      onValueChange={(values) => {
                        setBudgetValue(values);
                        field.handleChange(values);
                        field.handleBlur();
                      }}
                      min={10}
                      max={5000}
                      step={10}
                      className="w-full"
                    />
                  </div>
                  <FieldError
                    errors={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                        : undefined
                    }
                  />
                </Field>
              )}
            </form.Field>
          </div>
        </form>

        {/* Suggested Plans Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold text-foreground">
              Suggested Plans
            </h2>
            <span className="text-xs text-[#F05D6D]">Swipe for more</span>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar -mx-6 px-6">
            {suggestedPlans.map((plan, idx) => (
              <div
                key={plan.id}
                className="min-w-[320px] shrink-0 bg-white rounded-2xl p-5 shadow-xs relative"
              >
                {plan.isBestMatch && (
                  <div className="absolute top-0 right-0 bg-[#F05D6D] text-white text-xs font-medium px-4 py-1.5 rounded-se-xl rounded-es-xl rounded-ss-xs rounded-ee-xs">
                    Best Match
                  </div>
                )}
                <div className="absolute top-12 right-3">
                  <DollarSign className="size-4 text-muted-foreground/30" />
                </div>
                <div className="mt-2 mb-3">
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {plan.title}
                  </h3>
                  <span
                    className="inline-block text-xs font-semibold px-2 py-1 rounded-full"
                    style={{
                      background: PlanTagBgColor[idx % 2],
                      color: PlanTagTextColor[idx % 2],
                    }}
                  >
                    {plan.tag}
                  </span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="size-4 text-romantic-400 mt-0.5 shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* How it flows Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-serif font-bold text-foreground">
            How it flows
          </h2>

          <div className="space-y-6">
            {dateFlow.map((item, index) => {
              const Icon = item.icon;
              const isFirst = index === 0;
              return (
                <div key={item.step} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'size-6 rounded-full flex items-center justify-center',
                        isFirst
                          ? 'bg-romantic-400'
                          : 'border-2 border-muted-foreground/30',
                      )}
                    >
                      {isFirst && (
                        <div className="size-2 rounded-full bg-white" />
                      )}
                    </div>
                    {index < dateFlow.length - 1 && (
                      <div className="w-0.5 h-12 bg-muted-foreground/20 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 flex items-center justify-between pt-1">
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-1">
                        {item.step}:
                      </div>
                      <div className="text-base font-medium text-foreground">
                        {item.title}
                      </div>
                    </div>
                    <Icon className="size-5 text-romantic-200" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 space-y-2">
        <Button
          onClick={handleLockDatePlan}
          className="w-full h-12 bg-slate-700 hover:bg-slate-800 text-white"
          size="lg"
        >
          <Lock className="size-5 text-romantic-400 mr-2" />
          Lock This Date Plan
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          You can still tweak it later.
        </p>
      </div>
    </div>
  );
}
