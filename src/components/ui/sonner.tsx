"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      icons={{
        info: <InfoIcon width={24} height={24} />,
        success: <CircleCheckIcon width={20} height={20} />,
        error: <OctagonXIcon width={20} height={20} />,
        warning: <TriangleAlertIcon width={24} height={24} />,
        loading: (
          <Loader2Icon className="animate-spin" width={20} height={20} />
        ),
        close: null,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: `rounded-lg gap-3 px-4 py-3 right-0 flex min-w-[240px] items-center shadow-sm border`,
          title: "text-sm font-normal text-foreground/90",
          description: "text-xs text-muted-foreground",
          content: "peer-[.is-exist]:w-[calc(100%-56px)] pr-0 gap-0",
          closeButton: "hidden",
          icon: "size-5 shrink-0 mr-2.5 flex justify-center items-center text-foreground/70",
          default:
            "bg-background/95 backdrop-blur-sm border-border text-foreground",
          info: "bg-blue-50/95 dark:bg-blue-950/30 backdrop-blur-sm border-blue-200/50 dark:border-blue-800/30 text-blue-700 dark:text-blue-300",
          success:
            "bg-green-50/95 dark:bg-green-950/30 backdrop-blur-sm border-green-200/50 dark:border-green-800/30 text-green-700 dark:text-green-300",
          error:
            "bg-red-50/95 dark:bg-red-950/30 backdrop-blur-sm border-red-200/50 dark:border-red-800/30 text-red-700 dark:text-red-300",
          warning:
            "bg-orange-50/95 dark:bg-orange-950/30 backdrop-blur-sm border-orange-200/50 dark:border-orange-800/30 text-orange-700 dark:text-orange-300",
          loading:
            "bg-blue-50/95 dark:bg-blue-950/30 backdrop-blur-sm border-blue-200/50 dark:border-blue-800/30 text-blue-700 dark:text-blue-300",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
