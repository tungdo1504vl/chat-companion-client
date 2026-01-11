"use client";

import { ArrowLeft, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TPageHeaderProps } from "./types";
import { cn } from "@/libs/tailwind/utils";

export default function PageHeader({
  title,
  onBackClick,
  onMenuClick,
  className,
}: TPageHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-3 border-b",
        className
      )}
    >
      {onBackClick ? (
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={onBackClick}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      ) : (
        <div className="h-9 w-9" />
      )}
      <h1 className="text-lg font-semibold">{title}</h1>
      {onMenuClick ? (
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={onMenuClick}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      ) : (
        <div className="h-9 w-9" />
      )}
    </div>
  );
}
