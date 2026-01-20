'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  ASSISTANT_ROUTES,
  buildPartnerDetailRoute,
  buildPartnerChatRoute,
  buildWinACrushRoute,
} from '@/constants/routes';
import { useRoutePreloader } from '@/components/transitions/route-preloader';
import {
  Heart,
  ChevronRight,
  InfoIcon,
  MessageCircleMoreIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/utils/helpers';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { PageHeader } from '@/components/commons/page-header';
import { usePartnerStoreState } from '@/stores/partner/provider';
import { toast } from 'sonner';
import { TPartner } from '@/stores/partner/types';

export default function PartnersPage() {
  const router = useRouter();
  const partners = usePartnerStoreState((state) => state.partners);
  const initialize = usePartnerStoreState((state) => state.initialize);
  const [isMounted, setIsMounted] = useState(false);
  const { preloadRoute } = useRoutePreloader();

  // Initialize store on client side only to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    initialize();
  }, [initialize]);

  const handleCreatePartner = () => {
    router.push(ASSISTANT_ROUTES.PARTNER_CREATE);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <PageHeader title="relationships" onBackClick={handleBack} />
      <main className="flex-1 px-6 pb-24 overflow-y-auto overflow-x-hidden bg-(--color-background-light) dark:bg-(--color-background-dark)">
        {/* Title Section */}
        <div className="text-center mb-10 pt-6">
          <h1 className="font-serif text-4xl text-(--color-text-main-light) dark:text-(--color-text-main-dark) mb-3 leading-tight">
            Strategy to win a crush
          </h1>
          <p className="text-(--color-text-sub-light) dark:text-(--color-text-sub-dark) font-serif italic text-lg">
            Choose who you're thinking about
          </p>
        </div>

        {/* Heart Icon with Gradient Background */}
        <div className="flex justify-center mb-8 relative">
          <div className="absolute inset-0 bg-primary opacity-10 blur-3xl rounded-full transform scale-150"></div>
          <div className="relative w-24 h-24 rounded-full bg-white dark:bg-(--color-card-dark) p-1 shadow-sm flex items-center justify-center border border-border saturate-[0.85] contrast-[1.1]">
            <Heart className="text-5xl text-primary/80 fill-primary/20" size={48} />
          </div>
        </div>

        {/* Partner Cards Section */}
        <div className="space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-(--color-text-sub-light) dark:text-(--color-text-sub-dark) font-bold mb-4 ml-1">
            Your Connections
          </h2>

          {!isMounted ? null : partners && partners.length > 0 ? (
            <div className="space-y-4">
              {partners.map((partner: TPartner) => (
                <div
                  key={partner.partner_id}
                  role="button"
                  tabIndex={0}
                  className="group relative bg-(--color-card-light) dark:bg-(--color-card-dark) p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-primary/20 cursor-pointer"
                  onClick={() => {
                    router.push(buildWinACrushRoute(partner.partner_id));
                  }}
                  onMouseEnter={() => preloadRoute(buildWinACrushRoute(partner.partner_id))}
                  onTouchStart={() => preloadRoute(buildWinACrushRoute(partner.partner_id))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      router.push(buildWinACrushRoute(partner.partner_id));
                    }
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="size-16 shrink-0 border-2 border-white dark:border-gray-600 shadow-sm">
                        {partner.avatarUrl ? (
                          <AvatarImage
                            src={partner.avatarUrl}
                            alt={partner.partner_profile?.basic_info?.name}
                            className="rounded-full object-cover"
                          />
                        ) : null}
                        <AvatarFallback className="bg-muted text-foreground">
                          {getInitials(partner.partner_profile?.basic_info?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white dark:border-(--color-card-dark) rounded-full"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-xl text-(--color-text-main-light) dark:text-(--color-text-main-dark) font-semibold">
                        {partner.partner_profile?.basic_info?.name}
                      </h3>
                      <p className="text-sm text-(--color-text-sub-light) dark:text-(--color-text-sub-dark)">
                        {partner.partner_profile?.basic_info?.age}
                        {partner.partner_profile?.basic_info?.city_of_birth &&
                          partner.partner_profile?.basic_info?.country_of_birth
                          ? ` | ${partner.partner_profile?.basic_info?.city_of_birth}, ${partner.partner_profile?.basic_info?.country_of_birth}`
                          : ''}
                      </p>
                    </div>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-10 h-10 rounded-full text-gray-300 group-hover:text-primary transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <ChevronRight className="size-5 shrink-0" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-36 p-2" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-col gap-1.5">
                          <button
                            type="button"
                            className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 p-2 rounded text-left"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(
                                buildPartnerDetailRoute(partner.partner_id)
                              );
                            }}
                            onMouseEnter={() => preloadRoute(buildPartnerDetailRoute(partner.partner_id))}
                            onTouchStart={() => preloadRoute(buildPartnerDetailRoute(partner.partner_id))}
                          >
                            <InfoIcon className="size-5 text-muted-foreground shrink-0" />
                            <span>View Detail</span>
                          </button>
                          <button
                            type="button"
                            className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 p-2 rounded text-left"
                            onClick={(e) => {
                              e.stopPropagation();
                              const partnerId = partner.partner_id;
                              if (partnerId) {
                                router.push(buildPartnerChatRoute(partnerId));
                              }
                            }}
                            onMouseEnter={() => {
                              const partnerId = partner.partner_id;
                              if (partnerId) {
                                preloadRoute(buildPartnerChatRoute(partnerId));
                              }
                            }}
                            onTouchStart={() => {
                              const partnerId = partner.partner_id;
                              if (partnerId) {
                                preloadRoute(buildPartnerChatRoute(partnerId));
                              }
                            }}
                          >
                            <MessageCircleMoreIcon className="size-5 text-muted-foreground shrink-0" />
                            <span>Chat</span>
                          </button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-(--color-text-sub-light) dark:text-(--color-text-sub-dark)">
              <p className="text-sm">No partners yet. Create your first partner profile!</p>
            </div>
          )}
        </div>

        {/* Create Partner Button Section */}
        <div className="mt-8">
          <Button
            onClick={handleCreatePartner}
            aria-label="Continue to next step"
            size="lg"
            className="size-full bg-primary  text-white font-bold py-5 px-6 rounded-full shadow-lg shadow-primary/30 flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity duration-200 ease-out transform active:scale-95 group text-lg motion-reduce:transition-none [&_svg:not([class*='size-'])]:size-6"
            onMouseEnter={() => preloadRoute(ASSISTANT_ROUTES.PARTNER_CREATE)}
            onTouchStart={() => preloadRoute(ASSISTANT_ROUTES.PARTNER_CREATE)}
          >
            <Heart className="text-3xl group-hover:animate-pulse motion-reduce:animate-none"
              size={24} />
            <span className="font-bold text-lg tracking-wide">
              Create a partner profile
            </span>
          </Button>
          <p className="text-center mt-4 text-xs text-primary/60 dark:text-primary/80 uppercase tracking-widest font-semibold">
            Private & Personal
          </p>
        </div>
      </main>
    </>

  );
}
