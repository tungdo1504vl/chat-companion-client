"use client";

import * as React from "react";
import { Upload, X, Loader2, FileAudio } from "lucide-react";
import { cn } from "@/libs/tailwind/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  processAudioFile,
  formatFileSize,
  type AudioFileInfo,
} from "@/utils/audio";

export interface VoiceUploadProps {
  value?: AudioFileInfo | null;
  onChange?: (value: AudioFileInfo | null) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  description?: string;
  required?: boolean;
  error?: string;
}

export function VoiceUpload({
  value,
  onChange,
  onError,
  disabled = false,
  className,
  label = "Voice Recording",
  description,
  required = false,
  error,
}: Readonly<VoiceUploadProps>) {
  const [isLoading, setIsLoading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const audioInfo = await processAudioFile(file);
      onChange?.(audioInfo);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to process audio file";
      onError?.(errorMessage);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    onChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    if (!disabled && !isLoading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <Field className={cn("flex flex-col gap-2", className)}>
      {label && (
        <FieldLabel className={required ? undefined : "text-muted-foreground"}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </FieldLabel>
      )}
      {description && (
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      )}

      <div className="flex flex-col gap-3">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,.wav,.mp3,.m4a,.ogg,.webm"
          onChange={handleFileSelect}
          disabled={disabled || isLoading}
          className="hidden"
          aria-label={label}
        />

        {value !== null && value !== undefined ? (
          /* File preview state */
          <div
            className={cn(
              "flex items-center gap-3 p-4 rounded-md border",
              "bg-card",
              "transition-colors duration-150 ease-out"
            )}
          >
            <div className="shrink-0">
              <div className="size-10 rounded-md bg-primary/10 flex items-center justify-center">
                <FileAudio className="size-5 text-primary" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{value.fileName}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(value.fileSize)} • {value.format.toUpperCase()}
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              disabled={disabled || isLoading}
              className="shrink-0 size-9"
              aria-label="Remove file"
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          /* Upload button state */
          <Button
            type="button"
            variant="outline"
            onClick={handleButtonClick}
            disabled={disabled || isLoading}
            className={cn(
              "h-12 w-full flex items-center justify-center gap-2",
              "border-dashed border-2",
              "hover:bg-accent/50 hover:border-primary/50",
              "transition-colors duration-150 ease-out",
              "focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Upload className="size-5" />
                <span>Choose File</span>
              </>
            )}
          </Button>
        )}
      </div>

      {/* Error message */}
      {error && <FieldError errors={[{ message: error }]} />}
    </Field>
  );
}
