"use client";

import { Suspense, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/libs/tailwind/utils";
import { Spinner } from "@/components/ui/spinner";
import { TProfileTabs } from "./types";

export default function ProfileTab({
  tabs,
  activeTab,
  onTabChange,
  defaultValue,
  className,
}: TProfileTabs) {
  const initialValue = defaultValue || tabs[0]?.value || "";
  const value = activeTab ?? initialValue;

  const content = useMemo(() => {
    return tabs.find((tab) => tab.value === value)?.content;
  }, [tabs, value]);

  return (
    <Tabs
      value={value}
      defaultValue={value ? undefined : initialValue}
      onValueChange={onTabChange}
      className={cn("w-full", className)}
    >
      <TabsList className="h-auto w-full justify-start gap-1 rounded-none border-b bg-transparent p-0">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              "rounded-none text-base  px-4 py-2 font-medium text-muted-foreground",
              "data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent",
              "hover:bg-transparent hover:text-primary",
              "focus-visible:ring-0 focus-visible:ring-offset-0"
            )}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={value} className="mt-0 py-6">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <Spinner className="size-6" />
            </div>
          }
        >
          {content}
        </Suspense>
      </TabsContent>
    </Tabs>
  );
}
