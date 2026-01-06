'use client';

import { useRouter } from 'next/navigation';
import { ChevronDown, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import MobileHeader from '@/components/commons/mobile-header/mobile-header';
import { useComputeGet } from '@/hooks/use-compute-get';
import { createTaskParams } from '@/utils/helpers';
import { TASK_TYPE } from '@/constants/task';
import { useSession } from '@/libs/better-auth/client';
import { useEffect } from 'react';

interface Partner {
  id: string;
  name: string;
  age: number;
  location: string;
  avatarUrl?: string;
}

// Mock data - replace with actual API call
const mockPartners: Partner[] = [
  {
    id: '1',
    name: 'Alex Chen',
    age: 28,
    location: 'New York, NY',
    avatarUrl: '/images/placeholder-avatar.png',
  },
  {
    id: '2',
    name: 'Maria Rodriguez',
    age: 26,
    location: 'Los Angeles, CA',
    avatarUrl: '/images/placeholder-avatar.png',
  },
];

export default function PartnersPage() {
  const router = useRouter();
  const partners = mockPartners;
  const hasPartners = partners.length > 0;
  const { data: session } = useSession();
  const userId = session?.user.id;
  const aa = createTaskParams(TASK_TYPE.PARTNER_PROFILE_LIST, {
    user_id: userId || '',
    // user_id: 'bf48a9a3-dad1-424e-9b74-fc319f43cf34',
    include_archived: false,
  });
  const { data, refetch, isLoading, isError } = useComputeGet(aa);
  console.log('data:', data);

  const handleCreatePartner = () => {
    router.push('/partner-create');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <MobileHeader title="Strategy for a successful crush" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 overflow-x-hidden">
        {/* Title Section */}
        <div className="relative mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Select partner
          </h2>
          <p className="text-sm text-muted-foreground pr-20">
            Please enter your information for an accurate chart analysis
          </p>

          {/* Gradient Circle with Smiley */}
          <div className="absolute top-0 right-0 w-40 h-40 -mt-8 -mr-8">
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-blue-200 via-green-200 to-pink-200 blur-3xl opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Smile className="size-16 text-foreground/30" />
            </div>
          </div>
        </div>

        {/* Partner Cards */}
        {hasPartners && (
          <div className="space-y-3 mb-6">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="bg-card border border-border rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:bg-accent/50 transition-colors"
              >
                <Avatar className="size-12 shrink-0">
                  {partner.avatarUrl ? (
                    <AvatarImage src={partner.avatarUrl} alt={partner.name} />
                  ) : null}
                  <AvatarFallback className="bg-muted text-foreground">
                    {getInitials(partner.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base text-foreground mb-1">
                    {partner.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {partner.age} | {partner.location}
                  </p>
                </div>

                <ChevronDown className="size-5 text-muted-foreground shrink-0" />
              </div>
            ))}
          </div>
        )}

        {/* Create Partner Button */}
        {hasPartners && (
          <Button
            onClick={handleCreatePartner}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-medium mb-8"
          >
            Create a partner profile
          </Button>
        )}

        {/* Empty State */}
        {!hasPartners && (
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
        )}
      </div>
    </div>
  );
}
