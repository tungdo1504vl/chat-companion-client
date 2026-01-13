import {
  Settings,
  Heart,
  MessageCircle,
  Clock,
  Infinity,
  Gift,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/libs/tailwind/utils";
import Image from "next/image";
import Link from "next/link";
import { ASSISTANT_ROUTES } from "@/constants/routes";
import { TypographyH1 } from "@/components/ui/typgoraphy";

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor: string;
  status: "upcoming" | "new";
}

// Gradient options for "New" cards - cycle through these
const newCardGradients = ["gradient-orange-pink", "gradient-pink-purple"];

const features: FeatureCard[] = [
  {
    id: "2",
    title: "Strategy for a Successful Crush",
    description:
      "For that painful one-sided love, we'll help you find a way forward.",
    icon: Heart,
    iconBgColor: "bg-pink-500",
    status: "new",
  },
  {
    id: "5",
    title: "Making Up After a Fight",
    description:
      "How to wisely reconcile and restore your relationship after an awkward and difficult fight.",
    icon: Clock,
    iconBgColor: "bg-pink-500",
    status: "new",
  },
  {
    id: "1",
    title: "Analyze Current Relationship Situation",
    description:
      "Get an objective perspective on your complex relationship and understand your partner's poi...",
    icon: Settings,
    iconBgColor: "bg-purple-500",
    status: "upcoming",
  },
  {
    id: "3",
    title: "Texting & 'Talking Stage' Clinic",
    description:
      "Left on read? Message unseen? Get advice and analysis on confusing texting conversations d...",
    icon: MessageCircle,
    iconBgColor: "bg-teal-500",
    status: "upcoming",
  },
  {
    id: "4",
    title: "Advice for a Happy Relationship",
    description:
      "Get realistic advice for a happier and healthier relationship.",
    icon: Heart,
    iconBgColor: "bg-purple-500",
    status: "upcoming",
  },
  {
    id: "6",
    title: "Overcoming a Relationship Rut",
    description: "Learn how to wisely overcome a rut with a long-term partner.",
    icon: Infinity,
    iconBgColor: "bg-purple-500",
    status: "upcoming",
  },
  {
    id: "7",
    title: "Anniversary/Event Planning",
    description:
      "Plan a romantic anniversary that will touch your partner's heart on a special day.",
    icon: Gift,
    iconBgColor: "bg-purple-500",
    status: "upcoming",
  },
];

export default function AssistantPage() {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-4 pt-4 pb-6">
        <div className="flex items-center justify-between">
          <TypographyH1 className="text-4xl font-serif font-bold text-foreground">
            Your relationship friend
          </TypographyH1>
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
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const isNew = feature.status === "new";

          // Get gradient for "New" cards (cycle through gradients)
          const newCardGradientIndex = features
            .slice(0, index)
            .filter((f) => f.status === "new").length;
          const gradientClass = isNew
            ? newCardGradients[newCardGradientIndex % newCardGradients.length]
            : "";

          return (
            <Link
              className="block"
              href={ASSISTANT_ROUTES.PARTNERS}
              key={feature.id}
            >
              {isNew ? (
                <div
                  className={cn(
                    "relative w-full rounded-4xl p-6 h-40 flex flex-col justify-center text-white shadow-soft overflow-hidden group cursor-pointer active:scale-[0.98] transition-transform",
                    gradientClass
                  )}
                >
                  {/* Badge */}
                  <div className="absolute top-5 right-5 bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                    New
                  </div>
                  {/* Content */}
                  <div className="w-full">
                    <h2 className="font-serif text-2xl font-bold mb-1 leading-tight pr-8">
                      {feature.title}
                    </h2>
                    <div className="flex items-center justify-between gap-2">
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
                  <span className="absolute top-1 rounded-2xl right-4 bg-amber-200 px-2 py-1 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                    Up Coming
                  </span>
                  <div className="w-10 h-10 rounded-full bg-stone-200/60 shadow-md flex items-center justify-center text-stone-700 shrink-0 mr-3">
                    <Icon className="text-lg" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-gray-800 leading-snug pr-8">
                    {feature.title}
                  </h3>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
