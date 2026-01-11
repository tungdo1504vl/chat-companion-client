"use client";

import { useId } from "react";
import { Share2 } from "lucide-react";
import { siInstagram } from "simple-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";

interface SocialSignalsSectionProps {
  instagramUrl?: string;
  onInstagramUrlChange?: (url: string) => void;
  className?: string;
}

/**
 * Instagram icon component using simple-icons
 * Renders the Instagram brand icon with Instagram's gradient colors
 */
function InstagramIcon({ className }: Readonly<{ className?: string }>) {
  const viewBoxRegex = /viewBox="([^"]*)"/;
  const viewBoxMatch = viewBoxRegex.exec(siInstagram.svg);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 24 24";
  const gradientId = useId();

  return (
    <svg
      className={className}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Instagram"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#833AB4" />
          <stop offset="50%" stopColor="#FD1D1D" />
          <stop offset="100%" stopColor="#FCB045" />
        </linearGradient>
      </defs>
      <path d={siInstagram.path} fill={`url(#${gradientId})`} />
    </svg>
  );
}

export function SocialSignalsSection({
  instagramUrl = "",
  onInstagramUrlChange,
  className,
}: SocialSignalsSectionProps) {
  const hasUrl = instagramUrl && instagramUrl.trim() !== "";

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Share2 className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold">Social Signals</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Connect your social presence
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Instagram */}
        <Field className="flex flex-col gap-2">
          <div className="flex items-center justify-between mb-1">
            <FieldLabel className="flex items-center gap-2">
              <InstagramIcon className="h-5 w-5 shrink-0" />
              Instagram
            </FieldLabel>
            {hasUrl && (
              <span className="text-sm text-green-600 dark:text-green-400">
                ✓ Linked
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              type="url"
              name="instagramUrl"
              value={instagramUrl}
              onChange={(e) => onInstagramUrlChange?.(e.target.value)}
              placeholder="https://instagram.com/username"
              disabled={!onInstagramUrlChange}
              className="flex-1"
            />
            {hasUrl && onInstagramUrlChange && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onInstagramUrlChange("")}
                disabled={!onInstagramUrlChange}
              >
                Remove
              </Button>
            )}
          </div>
        </Field>
      </CardContent>
    </Card>
  );
}
