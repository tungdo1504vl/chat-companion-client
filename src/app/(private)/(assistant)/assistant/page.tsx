import {
  Settings,
  Heart,
  MessageCircle,
  Clock,
  Infinity,
  Gift,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/libs/tailwind/utils';
import Image from 'next/image';
import Link from 'next/link';
import { ASSISTANT_ROUTES } from '@/constants/routes';

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor: string;
  status: 'upcoming' | 'new';
}

const features: FeatureCard[] = [
  {
    id: '1',
    title: 'Analyze Current Relationship S...',
    description:
      "Get an objective perspective on your complex relationship and understand your partner's poi...",
    icon: Settings,
    iconBgColor: 'bg-purple-500',
    status: 'upcoming',
  },
  {
    id: '2',
    title: 'Strategy for a Successful Crush',
    description:
      "For that painful one-sided love, we'll help you find a way forward.",
    icon: Heart,
    iconBgColor: 'bg-pink-500',
    status: 'new',
  },
  {
    id: '3',
    title: "Texting & 'Talking Stage' Clinic",
    description:
      'Left on read? Message unseen? Get advice and analysis on confusing texting conversations d...',
    icon: MessageCircle,
    iconBgColor: 'bg-teal-500',
    status: 'upcoming',
  },
  {
    id: '4',
    title: 'Advice for a Happy Relationship',
    description:
      'Get realistic advice for a happier and healthier relationship.',
    icon: Heart,
    iconBgColor: 'bg-purple-500',
    status: 'upcoming',
  },
  {
    id: '5',
    title: 'Making Up After a Fight',
    description:
      'How to wisely reconcile and restore your relationship after an awkward and difficult fight.',
    icon: Clock,
    iconBgColor: 'bg-pink-500',
    status: 'new',
  },
  {
    id: '6',
    title: 'Overcoming a Relationship Rut',
    description: 'Learn how to wisely overcome a rut with a long-term partner.',
    icon: Infinity,
    iconBgColor: 'bg-purple-500',
    status: 'upcoming',
  },
  {
    id: '7',
    title: 'Anniversary/Event Planning',
    description:
      "Plan a romantic anniversary that will touch your partner's heart on a special day.",
    icon: Gift,
    iconBgColor: 'bg-purple-500',
    status: 'upcoming',
  },
];

export default function AssistantPage() {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-4 pt-4 pb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">
            Your relationship friend
          </h1>
          <div className="relative w-16 h-16">
            <Image
              src="/mascot/mascot-removebg-preview.png"
              alt="Mascot"
              fill
              className="object-contain opacity-80"
            />
          </div>
        </div>
      </div>

      {/* Feature Cards List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link className="block" href={ASSISTANT_ROUTES.PARTNERS} key={feature.id}>
              <div className="bg-card border border-border rounded-lg p-4 flex items-start gap-4 cursor-pointer hover:bg-accent/50 transition-colors">
                {/* Icon */}
                <div
                  className={cn(
                    'rounded-full p-3 shrink-0',
                    feature.iconBgColor
                  )}
                >
                  <Icon className="size-5 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-sm text-foreground leading-tight">
                      {feature.title}
                    </h3>
                    <ChevronRight className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                    {feature.description}
                  </p>
                  <Badge
                    variant={feature.status === 'new' ? 'default' : 'secondary'}
                    className={cn(
                      'text-xs',
                      feature.status === 'new' &&
                        'bg-pink-500 text-white border-pink-500'
                    )}
                  >
                    {feature.status === 'new' ? 'New' : 'Up Comming'}
                  </Badge>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
