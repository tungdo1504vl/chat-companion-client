'use client';

import { useState } from "react";
import {
  Settings,
  Heart,
  MessageCircle,
  Clock,
  Infinity,
  Gift,
  ChevronRight,
  Users,
  MessageSquare,
  TrendingUp,
  Handshake,
  Shield,
  ThumbsUp,
  XCircle,
  AlertCircle,
  UserCheck,
  Sparkles,
} from "lucide-react";
import { cn } from "@/libs/tailwind/utils";
import Image from "next/image";
import Link from "next/link";
import { ASSISTANT_ROUTES } from "@/constants/routes";
import { TypographyH1 } from "@/components/ui/typgoraphy";
import { useRoutePreloader } from "@/components/transitions/route-preloader";
import { ChipGroup } from "@/components/ui/chip-group";

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor: string;
  status: "upcoming" | "new";
  category: "romantic" | "work" | "personal";
}

// Gradient options for "New" cards - cycle through these
const newCardGradients = ["gradient-orange-pink", "gradient-pink-purple"];

const features: FeatureCard[] = [
  // Romantic category
  {
    id: "romantic-1",
    title: "Strategy for a Successful Crush",
    description:
      "For that painful one-sided love, we'll help you find a way forward.",
    icon: Heart,
    iconBgColor: "bg-pink-500",
    status: "new",
    category: "romantic",
  },
  {
    id: "romantic-2",
    title: "Making Up After a Fight",
    description:
      "How to wisely reconcile and restore your relationship after an awkward and difficult fight.",
    icon: Clock,
    iconBgColor: "bg-pink-500",
    status: "new",
    category: "romantic",
  },
  {
    id: "romantic-3",
    title: "Analyze Current Relationship Situation",
    description:
      "Get an objective perspective on your complex relationship and understand your partner's poi...",
    icon: Settings,
    iconBgColor: "bg-purple-500",
    status: "upcoming",
    category: "romantic",
  },
  {
    id: "romantic-4",
    title: "Texting & 'Talking Stage' Clinic",
    description:
      "Left on read? Message unseen? Get advice and analysis on confusing texting conversations d...",
    icon: MessageCircle,
    iconBgColor: "bg-teal-500",
    status: "upcoming",
    category: "romantic",
  },
  {
    id: "romantic-5",
    title: "Advice for a Happy Relationship",
    description:
      "Get realistic advice for a happier and healthier relationship.",
    icon: Heart,
    iconBgColor: "bg-purple-500",
    status: "upcoming",
    category: "romantic",
  },
  {
    id: "romantic-6",
    title: "Overcoming a Relationship Rut",
    description: "Learn how to wisely overcome a rut with a long-term partner.",
    icon: Infinity,
    iconBgColor: "bg-purple-500",
    status: "upcoming",
    category: "romantic",
  },
  {
    id: "romantic-7",
    title: "Anniversary/Event Planning",
    description:
      "Plan a romantic anniversary that will touch your partner's heart on a special day.",
    icon: Gift,
    iconBgColor: "bg-purple-500",
    status: "upcoming",
    category: "romantic",
  },
  // Work category - Highlight Use Cases (status: "new")
  {
    id: "work-1",
    title: "Difficult Work Conversation",
    description:
      "Say what needs to be said—clearly, calmly, and without damaging the relationship.",
    icon: AlertCircle,
    iconBgColor: "bg-blue-500",
    status: "new",
    category: "work",
  },
  {
    id: "work-2",
    title: "Talk to a Colleague",
    description:
      "Handle everyday work conversations without awkwardness or overthinking.",
    icon: Users,
    iconBgColor: "bg-blue-500",
    status: "new",
    category: "work",
  },
  {
    id: "work-3",
    title: "Give Feedback at Work",
    description:
      "Share honest feedback in a way that feels respectful and constructive.",
    icon: MessageSquare,
    iconBgColor: "bg-blue-500",
    status: "new",
    category: "work",
  },
  // Work category - Normal Use Cases (status: "upcoming")
  {
    id: "work-4",
    title: "Push Back a Request",
    description:
      "Politely decline or renegotiate a request without guilt or tension.",
    icon: XCircle,
    iconBgColor: "bg-blue-500",
    status: "upcoming",
    category: "work",
  },
  {
    id: "work-5",
    title: "Ask for Help or Support",
    description:
      "Reach out without sounding weak or unprepared.",
    icon: Handshake,
    iconBgColor: "bg-blue-500",
    status: "upcoming",
    category: "work",
  },
  {
    id: "work-6",
    title: "Repair a Work Relationship",
    description:
      "Clear the air after misunderstandings or conflict.",
    icon: UserCheck,
    iconBgColor: "bg-blue-500",
    status: "upcoming",
    category: "work",
  },
  {
    id: "work-7",
    title: "Follow Up After a Meeting",
    description:
      "Send the right message to move things forward.",
    icon: MessageCircle,
    iconBgColor: "bg-blue-500",
    status: "upcoming",
    category: "work",
  },
  {
    id: "work-8",
    title: "Express Appreciation at Work",
    description:
      "Say thank you in a genuine, professional way.",
    icon: ThumbsUp,
    iconBgColor: "bg-blue-500",
    status: "upcoming",
    category: "work",
  },
  {
    id: "work-9",
    title: "Set Boundaries at Work",
    description:
      "Protect your time and energy without burning bridges.",
    icon: Shield,
    iconBgColor: "bg-blue-500",
    status: "upcoming",
    category: "work",
  },
  // Personal category - Highlight Use Cases (status: "new")
  {
    id: "personal-1",
    title: "Win a Crush / Confession",
    description:
      "Express your feelings honestly—without rushing or putting pressure on them.",
    icon: Sparkles,
    iconBgColor: "bg-pink-500",
    status: "new",
    category: "personal",
  },
  {
    id: "personal-2",
    title: "Repair a Relationship",
    description:
      "Rebuild connection after a fight, silence, or emotional distance.",
    icon: Heart,
    iconBgColor: "bg-pink-500",
    status: "new",
    category: "personal",
  },
  {
    id: "personal-3",
    title: "Difficult Personal Conversation",
    description:
      "Talk about sensitive topics with care, clarity, and emotional safety.",
    icon: AlertCircle,
    iconBgColor: "bg-pink-500",
    status: "new",
    category: "personal",
  },
  // Personal category - Normal Use Cases (status: "upcoming")
  {
    id: "personal-4",
    title: "Show Care & Appreciation",
    description:
      "Let them feel seen through small but meaningful words or actions.",
    icon: Gift,
    iconBgColor: "bg-pink-500",
    status: "upcoming",
    category: "personal",
  },
  {
    id: "personal-5",
    title: "Reconnect After Distance",
    description:
      "Reach out after time apart without making it awkward.",
    icon: MessageCircle,
    iconBgColor: "bg-pink-500",
    status: "upcoming",
    category: "personal",
  },
  {
    id: "personal-6",
    title: "Clear a Misunderstanding",
    description:
      "Explain your side without escalating emotions.",
    icon: MessageSquare,
    iconBgColor: "bg-pink-500",
    status: "upcoming",
    category: "personal",
  },
  {
    id: "personal-7",
    title: "Support Someone Emotionally",
    description:
      "Be there for them—even when you don't know what to say.",
    icon: Heart,
    iconBgColor: "bg-pink-500",
    status: "upcoming",
    category: "personal",
  },
  {
    id: "personal-8",
    title: "Say No Without Guilt",
    description:
      "Protect your boundaries while staying kind.",
    icon: Shield,
    iconBgColor: "bg-pink-500",
    status: "upcoming",
    category: "personal",
  },
  {
    id: "personal-9",
    title: "Navigate Early Dating Stage",
    description:
      "Understand signals, pacing, and what to say next.",
    icon: TrendingUp,
    iconBgColor: "bg-pink-500",
    status: "upcoming",
    category: "personal",
  },
  {
    id: "personal-10",
    title: "Maintain a Healthy Relationship",
    description:
      "Keep communication open and balanced over time.",
    icon: Infinity,
    iconBgColor: "bg-pink-500",
    status: "upcoming",
    category: "personal",
  },
];

const chipOptions = [
  { value: "romantic", label: "Romantic", icon: "💖" },
  { value: "work", label: "Work", icon: "💼" },
  { value: "personal", label: "Personal", icon: "🤝" },
];

export default function AssistantPage() {
  const { preloadRoute } = useRoutePreloader();
  const [selectedCategory, setSelectedCategory] = useState<string>("romantic");

  const filteredFeatures = features.filter(
    (feature) => feature.category === selectedCategory
  );

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-4 pt-6 pb-6">
        <div className="flex items-center justify-between">
          <TypographyH1 className="text-5xl font-serif font-bold text-foreground">
            Your relationship friend
          </TypographyH1>
          <Image
            src="/mascot/mascot-removebg-preview.png"
            alt="Mascot"
            width={80}
            height={80}
            className="object-contain opacity-80 scale-200"
          />
        </div>
      </div>

      {/* Chip Group */}
      <div className="px-4">
        <ChipGroup
          options={chipOptions}
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        />
      </div>

      {/* Feature Cards List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {filteredFeatures.map((feature, index) => {
          const Icon = feature.icon;
          const isNew = feature.status === "new";

          // Get gradient for "New" cards (cycle through gradients)
          // Always ensure gradient exists for new cards
          const newCardGradientIndex = filteredFeatures
            .slice(0, index)
            .filter((f) => f.status === "new").length;

          // Ensure gradient class always exists for new cards with fallback
          const gradientClass = isNew
            ? newCardGradients[
            newCardGradientIndex % newCardGradients.length
            ] || newCardGradients[0] // Fallback to first gradient if somehow undefined
            : "";

          return (
            <Link
              className="block"
              href={ASSISTANT_ROUTES.PARTNERS}
              key={feature.id}
              onMouseEnter={() => preloadRoute(ASSISTANT_ROUTES.PARTNERS)}
              onTouchStart={() => preloadRoute(ASSISTANT_ROUTES.PARTNERS)}
            >
              {isNew ? (
                <div
                  className={cn(
                    gradientClass, // Apply gradient class first to ensure it's not overridden
                    "relative w-full items-start justify-start rounded-4xl min-h-[152px] px-6 py-6 flex flex-col  text-white shadow-soft overflow-hidden group cursor-pointer active:scale-[0.98] transition-transform"
                  )}
                >

                  {/* Content */}
                  <div className="size-ful flex flex-col gap-2">
                    <div className="flex justify-start w-full">
                      <h2 className="font-serif text-2xl font-bold leading-tight pr-12">
                        {feature.title}
                      </h2>
                      {/* Badge */}

                      <div className=" bg-white/30 size-fit backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                        New
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <p className="font-sans text-white/90 text-sm font-medium">
                        {feature.description}
                      </p>
                      <div className=" text-white/80">
                        <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>
                  {/* Arrow Icon */}
                </div>
              ) : (
                <div className="bg-[#EFECE6] rounded-3xl p-4 flex items-center relative h-24">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-stone-50/80 shadow-md flex items-center justify-center text-stone-700 shrink-0 mr-3">
                      <Icon className="text-lg" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-gray-800 leading-snug pr-6">
                      {feature.title}
                    </h3>
                    <span className="size-fit text-nowrap rounded-2xl  bg-amber-200 px-2 py-1 text-gray-500 text-xs  font-bold uppercase tracking-wider">
                      Up Coming
                    </span>
                  </div>

                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
