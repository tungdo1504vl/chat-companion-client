"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ASSISTANT_ROUTES,
  buildPartnerDetailRoute,
  buildPartnerChatRoute,
  buildWinACrushRoute,
} from "@/constants/routes";
import {
  Smile,
  EllipsisVertical,
  InfoIcon,
  MessageCircleMoreIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/commons/page-header";
import { useComputeGet } from "@/hooks/use-compute-get";
import { createTaskParams, getInitials } from "@/utils/helpers";
import { TASK_TYPE } from "@/constants/task";
import { useSession } from "@/libs/better-auth/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LoadingSkeleton } from "@/components/commons/loading-skeleton";

// Mock data - replace with actual API call
const mockPartners = [
  {
    partner_id: "1",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDFBu7ihKfRsIjq6dEDQDkTqn4LzycaeVwJi-A8kD9EBRvazPeVl5o7enP19JsooIn6KBCFf-gl-JkhWnsJIfsQ1vb7ie0Jz2NOWaM_jCk9v15OTwILMkpv1yMyGNWoQ2mJIxRKZ9pzLAB32lk_5W15IJubeE7TcRxF2w1OrZLPJejDL_6KU3b_74wVpY8yoj2ejsuWIsNNDEYCwSF27MqvL_RjMapch817j9wSP9qmTFL5Sog3s2uXlxVubLske_JWd_TbNqcD8w",
    partner_profile: {
      basic_info: {
        name: "Quyen",
        age: 28,
        city_of_birth: "Da Nang",
        country_of_birth: "Vietnam",
      },
    },
  },
  // {
  //   partner_id: "2",
  //   avatarUrl: "/images/placeholder-avatar.png",
  //   partner_profile: {
  //     basic_info: {
  //       name: "Maria Rodriguez",
  //       age: 26,
  //       city_of_birth: "Los Angeles",
  //       country_of_birth: "United States",
  //     },
  //   },
  // },
];

export default function PartnersPage() {
  const router = useRouter();
  // const { data: session } = useSession();
  // const userId = session?.user.id;
  // const { data, isLoading, isFetching } = useComputeGet(
  //   createTaskParams(TASK_TYPE.PARTNER_PROFILE_LIST, {
  //     user_id: userId || "",
  //     include_archived: false,
  //   }),
  //   {
  //     enabled: Boolean(userId),
  //   }
  // );

  const handleCreatePartner = () => {
    router.push(ASSISTANT_ROUTES.PARTNER_CREATE);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <PageHeader
        title="Strategy for a successful crush"
        onBackClick={handleBack}
      />

      <div className="flex-1  overflow-y-auto px-4 overflow-x-hidden">
        {/* Title Section */}
        <div className="relative mb-6 pb-16 pt-4 flex">
          <h2 className="text-xl w-full text-accent-foreground mb-2">
            Select partner
          </h2>

          {/* Gradient Circle with Smiley */}
          <div className="relative flex items-center justify-center w-full h-40 -mt-8 -mr-8">
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-blue-200 via-green-200 to-pink-200 blur-3xl opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/mascot/mascot-removebg-preview.png"
                alt="Mascot"
                width={80}
                height={80}
                className="object-contain opacity-80 scale-200"
              />
            </div>
          </div>
        </div>

        {/* {isLoading && <LoadingSkeleton />} */}

        {/* Partner Cards */}
        {mockPartners && (
          <div
            className="space-y-3 z-10"
            style={{
              maxHeight: "calc(100vh - 450px)",
              overflowY: "auto",
            }}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {mockPartners.map((partner: any) => (
              <div
                key={partner.partner_id}
                role="button"
                tabIndex={0}
                className="bg-card border border-border rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => {
                  router.push(buildWinACrushRoute(partner.partner_id));
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(buildWinACrushRoute(partner.partner_id));
                  }
                }}
              >
                <Avatar className="size-12 shrink-0">
                  {partner.avatarUrl ? (
                    <AvatarImage src={partner.avatarUrl} alt={partner.name} />
                  ) : null}
                  <AvatarFallback className="bg-muted text-foreground">
                    {getInitials(partner.partner_profile?.basic_info?.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base text-foreground mb-1">
                    {partner.partner_profile?.basic_info?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {partner.partner_profile?.basic_info?.age}
                    {partner.partner_profile?.basic_info?.city_of_birth &&
                    partner.partner_profile?.basic_info?.country_of_birth
                      ? ` - ${partner.partner_profile?.basic_info?.city_of_birth}, ${partner.partner_profile?.basic_info?.country_of_birth}`
                      : ""}
                  </p>
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      className="cursor-pointer"
                      variant="link"
                      size="lg"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <EllipsisVertical className="size-5 text-muted-foreground shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-36 p-2">
                    <div className="flex flex-col gap-1.5">
                      <div
                        role="button"
                        tabIndex={0}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            buildPartnerDetailRoute(partner.partner_id)
                          );
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();
                            router.push(
                              buildPartnerDetailRoute(partner.partner_id)
                            );
                          }
                        }}
                      >
                        <InfoIcon className="size-5 text-muted-foreground shrink-0" />
                        <span>View Detail</span>
                      </div>
                      <div
                        role="button"
                        tabIndex={0}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          const partnerId = partner.partner_id;
                          if (partnerId) {
                            router.push(buildPartnerChatRoute(partnerId));
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();
                            const partnerId = partner.partner_id;
                            if (partnerId) {
                              router.push(buildPartnerChatRoute(partnerId));
                            }
                          }
                        }}
                      >
                        <MessageCircleMoreIcon className="size-5 text-muted-foreground shrink-0" />
                        <span>Chat</span>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ))}
          </div>
        )}

        {/* Create Partner Button */}
        {/* {data?.result?.partners.length > 0 && !isFetching && (
          <Button
            onClick={handleCreatePartner}
            className="w-full bg-primary mt-5 text-primary-foreground hover:bg-primary/90 h-12 text-base font-medium mb-8"
          >
            Create a partner profile
          </Button>
        )} */}

        <Button
          onClick={handleCreatePartner}
          className="w-full bg-primary mt-5 text-primary-foreground hover:bg-primary/90 h-12 text-base font-medium mb-8"
        >
          Create a partner profile
        </Button>

        {/* Empty State */}
        {/* {data && !hasPartners && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-foreground mb-2 text-center">
                If no partners exist
              </h3>
              <p className="text-sm text-muted-foreground text-center">
                Let create a partner profile
              </p>
            </div>

            <Button
              onClick={handleCreatePartner}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-medium"
            >
              Create a partner profile
            </Button>
          </div>
        )} */}
      </div>
    </div>
  );
}
