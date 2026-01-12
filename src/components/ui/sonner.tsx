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
          toast: `rounded-lg gap-2.5 px-2 py-2 right-0 flex min-w-[240px] items-center`,
          title: "text-sm font-medium",
          description: "text-xs",
          content: "peer-[.is-exist]:w-[calc(100%-56px)] pr-0 gap-0",
          closeButton: "hidden",
          icon: "size-5 ml-1 rounded-full flex justify-center items-center mr-0",
          default:
            "bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-100",
          info: "bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-100",
          success:
            "bg-green-50 dark:bg-green-950/50 text-green-900 dark:text-green-100",
          error: "bg-red-50 dark:bg-red-950/50 text-red-900 dark:text-red-100",
          warning:
            "bg-orange-50 dark:bg-orange-950/50 text-orange-900 dark:text-orange-100",
          loading:
            "bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-100",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
