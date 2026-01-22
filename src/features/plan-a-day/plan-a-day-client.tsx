'use client';

import { useState, useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import type { PartnerProfile } from '@/features/profile/partner/types';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/commons/page-header';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/commons/radio-group';
import { Select } from '@/components/commons/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Sparkles, MapPin, Lock, Check, DollarSign } from 'lucide-react';
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
  budget: [100], // evening + relaxed = 100
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
const PlanTagTextColor = ['#d95924', '#7592e7'];

const suggestedPlansA = [
  {
    id: '1',
    title: 'Slow Morning Coffee & Bookstore',
    tag: 'WARM & SINCERE',
    isBestMatch: true,
    features: [
      'Low-pressure, easy to talk',
      'Quiet space helps first conversations feel safe',
    ],
    dateFlow: [
      {
        step: 'MEET',
        title: 'Cozy local café (coffee / tea)',
      },
      {
        step: 'ACTIVITY',
        title: 'Browse a small bookstore together',
      },
      {
        step: 'END',
        title: 'Sit & chat about favorite books or hobbies',
      },
    ],
  },
  {
    id: '2',
    title: 'Breakfast & Park Stroll',
    tag: 'SIMPLE & CALM',
    isBestMatch: false,
    features: [
      'Natural pace, no awkward structure',
      'Walking side by side reduces pressure',
    ],
    dateFlow: [
      {
        step: 'MEET',
        title: 'Casual breakfast spot',
      },
      {
        step: 'ACTIVITY',
        title: 'Short walk in a nearby park',
      },
      {
        step: 'END',
        title: 'Sit on a bench, people-watch & talk',
      },
    ],
  },
  {
    id: '3',
    title: 'Morning Pastry & Quiet Talk',
    tag: 'LIGHT & SWEET',
    isBestMatch: false,
    features: [
      'Short and sweet for early-stage dating',
      'Easy to end on a good note',
    ],
    dateFlow: [
      {
        step: 'MEET',
        title: 'Bakery café',
      },
      {
        step: 'ACTIVITY',
        title: 'Share pastries, light conversation',
      },
      {
        step: 'END',
        title: 'Walk her back or say goodbye naturally',
      },
    ],
  },
];

const suggestedPlansB = [
  {
    id: '1',
    title: 'Fine Dining & City Lights',
    tag: 'ELEGANT',
    isBestMatch: true,
    features: [
      'Romantic without being overwhelming',
      'Creates a “chosen” feeling, not casual',
    ],
    dateFlow: [
      { step: 'MEET', title: 'Upscale restaurant' },
      { step: 'ACTIVITY', title: 'Slow dinner with wine' },
      {
        step: 'END',
        title: 'Short walk with city night view',
      },
    ],
  },
  {
    id: '2',
    title: 'Art Gallery & Intimate Dinner',
    tag: 'THOUGHTFUL & DEEP',
    isBestMatch: false,
    features: [
      'Art sparks natural conversation',
      'Shows emotional effort, not just money',
    ],
    dateFlow: [
      { step: 'MEET', title: 'Private gallery / exhibition' },
      { step: 'ACTIVITY', title: 'Share thoughts & impressions' },
      {
        step: 'END',
        title: 'Quiet fine-dining restaurant',
      },
    ],
  },
  {
    id: '3',
    title: 'Rooftop Lounge & Soft Music',
    tag: 'SOFT ROMANCE',
    isBestMatch: false,
    features: [
      'Romantic atmosphere without heavy talk',
      'Music helps fill silences naturally',
    ],
    dateFlow: [
      { step: 'MEET', title: 'Rooftop bar' },
      { step: 'ACTIVITY', title: 'Drinks & soft live music' },
      {
        step: 'END',
        title: 'Slow conversation under city lights',
      },
    ],
  },
];

const suggestedPlansC = [
  {
    id: '1',
    title: 'Casual Dinner & Night Walk',
    tag: 'EASY & NATURAL',
    isBestMatch: true,
    features: [
      'Comfortable, not intimidating',
      'Encourages honest conversation',
    ],
    dateFlow: [
      {
        step: 'MEET',
        title: 'Casual restaurant',
      },
      {
        step: 'ACTIVITY',
        title: 'Night walk nearby',
      },
      {
        step: 'END',
        title: 'Dessert stall or takeaway drink',
      },
    ],
  },
  {
    id: '2',
    title: 'Board Game Café',
    tag: 'FUN & CONNECTING',
    isBestMatch: false,
    features: ['Games reduce awkwardness', 'Learn about each other naturally'],
    dateFlow: [
      {
        step: 'MEET',
        title: 'Board game café',
      },
      {
        step: 'ACTIVITY',
        title: 'Play light games (no competition)',
      },
      {
        step: 'END',
        title: 'Talk about favorite moments',
      },
    ],
  },
  {
    id: '3',
    title: 'Dessert & Late Coffee',
    tag: 'SWEET & LOW PRESSURE',
    isBestMatch: false,
    features: ['Short, gentle evening date', 'Easy exit if energy runs low'],
    dateFlow: [
      {
        step: 'MEET',
        title: 'Dessert café',
      },
      {
        step: 'ACTIVITY',
        title: 'Share sweets & chat',
      },
      {
        step: 'END',
        title: 'Walk her to her ride / goodbye hug',
      },
    ],
  },
];

function formatBudget(value: number): string {
  return `$${value.toLocaleString()}`;
}

type PlanItem = {
  id: string;
  title: string;
  tag: string;
  isBestMatch: boolean;
  features: string[];
  dateFlow: Array<{
    step: string;
    title: string;
  }>;
};

type SuggestedPlan = PlanItem[];

export function PlanADayClient({ partnerProfile }: PlanADayClientProps) {
  const router = useRouter();
  const [budgetValue, setBudgetValue] = useState([100]); // evening + relaxed = 100
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [isInitialMount, setIsInitialMount] = useState(true);

  const form = useForm({
    defaultValues,
  });

  // Function to get budget based on timing and vibe
  const getBudgetByTimingAndVibe = (timing: Timing, vibe: Vibe): number => {
    if (timing === 'morning' && vibe === 'relaxed') {
      return 50;
    }
    if (timing === 'evening' && vibe === 'romantic') {
      return 1000;
    }
    if (timing === 'evening' && vibe === 'relaxed') {
      return 100;
    }
    // Default fallback
    return 1250;
  };

  // Function to update budget based on timing and vibe
  const updateBudget = (timing?: Timing, vibe?: Vibe) => {
    const currentTiming = timing ?? form.state.values.timing;
    const currentVibe = vibe ?? form.state.values.vibe;
    if (currentTiming && currentVibe) {
      const newBudget = [getBudgetByTimingAndVibe(currentTiming, currentVibe)];
      setBudgetValue(newBudget);
      form.setFieldValue('budget', newBudget);
    }
  };

  // Function to get plans based on timing and vibe
  const getPlansByTimingAndVibe = (
    timing: Timing,
    vibe: Vibe,
  ): SuggestedPlan => {
    if (timing === 'morning' && vibe === 'relaxed') {
      return suggestedPlansA;
    }
    if (timing === 'evening' && vibe === 'romantic') {
      return suggestedPlansB;
    }
    if (timing === 'evening' && vibe === 'relaxed') {
      return suggestedPlansC;
    }
    // Default fallback
    return suggestedPlansC;
  };

  // Initialize current plans based on default values
  const initialPlans = getPlansByTimingAndVibe(defaultValues.timing, defaultValues.vibe);
  const [currentPlans, setCurrentPlans] = useState<SuggestedPlan>(initialPlans);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    initialPlans[0]?.id ?? '1',
  );

  // Get selected plan and its dateFlow
  const selectedPlan = currentPlans.find((plan) => plan.id === selectedPlanId) ?? currentPlans[0];
  const currentDateFlow = selectedPlan?.dateFlow ?? [];

  // Effect to update plans when timing or vibe changes
  useEffect(() => {
    const timing = form.state.values.timing;
    const vibe = form.state.values.vibe;

    // Skip loading on initial mount
    if (isInitialMount) {
      setIsInitialMount(false);
      // Set selected plan to first plan on initial mount
      const initialPlans = getPlansByTimingAndVibe(timing, vibe);
      if (initialPlans.length > 0) {
        setSelectedPlanId(initialPlans[0].id);
      }
      return;
    }

    // Only trigger loading if both timing and vibe are set
    if (timing && vibe) {
      setIsLoadingPlans(true);

      // Fake loading delay
      const timer = setTimeout(() => {
        const newPlans = getPlansByTimingAndVibe(timing, vibe);
        setCurrentPlans(newPlans);
        // Reset to first plan when plans change
        if (newPlans.length > 0) {
          setSelectedPlanId(newPlans[0].id);
        }
        setIsLoadingPlans(false);
      }, 800); // 800ms fake loading

      return () => clearTimeout(timer);
    }
  }, [form.state.values.timing, form.state.values.vibe, isInitialMount]);

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
        smallTitle={true}
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
                      updateBudget(form.state.values.timing, value as Vibe);
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
                      updateBudget(value as Timing, form.state.values.vibe);
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

          {isLoadingPlans ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="size-8 text-romantic-400" />
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar -mx-6 px-6">
              {currentPlans.map((plan, idx) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={cn(
                    'min-w-[320px] shrink-0 bg-white rounded-2xl p-5 shadow-xs relative cursor-pointer transition-all',
                    selectedPlanId === plan.id
                      ? 'border-2 border-primary'
                      : 'border-2 border-transparent',
                  )}
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
          )}
        </div>

        {/* How it flows Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-serif font-bold text-foreground">
            How it flows
          </h2>

          {isLoadingPlans ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="size-8 text-romantic-400" />
            </div>
          ) : (
            <div className="space-y-6">
              {currentDateFlow.map((item, index) => {
                const stepNumber = index + 1;
                const isFirst = index === 0;
                return (
                  <div key={`${item.step}-${index}`} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          'size-8 rounded-full flex items-center justify-center font-semibold text-sm',
                          isFirst
                            ? 'bg-romantic-400 text-white'
                            : 'bg-romantic-100 text-romantic-600 border-2 border-romantic-200',
                        )}
                      >
                        {stepNumber}
                      </div>
                      {index < currentDateFlow.length - 1 && (
                        <div className="w-0.5 h-12 bg-muted-foreground/20 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 bg-white rounded-lg px-2 py-3">
                      <div>
                        <div className="text-xs text-primary font-medium mb-1">
                          {item.step}:
                        </div>
                        <div className="text-base font-medium text-foreground">
                          {item.title}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
