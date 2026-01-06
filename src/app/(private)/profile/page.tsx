'use client';

import { useState } from 'react';
import { ArrowLeft, MoreVertical, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProfileForm, BirthChart } from '@/features/profile/components';
import { TProfileFormData } from '@/features/profile/types';
import { useSession } from '@/libs/better-auth/client';

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');
  const { data: session } = useSession();

  const handleSubmit = async (data: TProfileFormData) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to save profile data
      console.log('Profile data:', data);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-semibold">My Profile</h1>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-6">
          {/* Profile Info */}
          <div className="flex flex-col items-center space-y-3 mb-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage
                  src={session?.user?.image || '/images/placeholder-avatar.png'}
                  alt="Profile"
                />
                <AvatarFallback>{session?.user?.name}</AvatarFallback>
              </Avatar>
              <Button
                variant="default"
                size="icon"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold">{session?.user?.name}</h2>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-2 bg-muted">
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Settings
              </TabsTrigger>
              <TabsTrigger
                value="birth-chart"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Birth Chart
              </TabsTrigger>
            </TabsList>

            {/* Settings Tab */}
            <TabsContent value="settings" className="mt-6">
              <ProfileForm onSubmit={handleSubmit} isLoading={isLoading} />
            </TabsContent>

            {/* Birth Chart Tab */}
            <TabsContent value="birth-chart" className="mt-6">
              <BirthChart />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
