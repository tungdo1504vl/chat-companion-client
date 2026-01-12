"use client";

import * as React from "react";
import {
  Upload,
  X,
  Loader2,
  FileAudio,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/libs/tailwind/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
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
  // New upload props
  onUpload?: (file: AudioFileInfo) => Promise<void>;
  isUploading?: boolean;
  uploadError?: string;
  autoUpload?: boolean;
  uploadSuccess?: boolean;
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
  onUpload,
  isUploading = false,
  uploadError,
  autoUpload = true,
  uploadSuccess = false,
}: Readonly<VoiceUploadProps>) {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const audioInfo = await processAudioFile(file);
      onChange?.(audioInfo);

      // Auto-upload if enabled and onUpload callback is provided
      if (autoUpload && onUpload) {
        try {
          await onUpload(audioInfo);
        } catch (error_) {
          // Upload error will be handled by parent component via uploadError prop
          console.error("Upload failed:", error_);
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to process audio file";
      onError?.(errorMessage);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualUpload = async () => {
    if (!value || !onUpload) return;

    try {
      await onUpload(value);
    } catch (error_) {
      // Upload error will be handled by parent component via uploadError prop
      console.error("Upload failed:", error_);
    }
  };

  const handleRemove = () => {
    onChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    if (!disabled && !isProcessing && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  // Determine if we should show loading state
  const isLoading = isProcessing || isUploading;

  // Determine which error to show (processing error takes precedence)
  let displayError: string | undefined;
  if (error) {
    displayError = error;
  } else if (uploadError) {
    displayError = uploadError;
  }

  // Determine button content based on state
  let buttonContent: React.ReactNode;
  if (isProcessing) {
    buttonContent = (
      <>
        <Loader2 className="size-5 animate-spin" />
        <span>Processing audio...</span>
      </>
    );
  } else if (isUploading) {
    buttonContent = (
      <>
        <Loader2 className="size-5 animate-spin" />
        <span>Uploading voice...</span>
      </>
    );
  } else {
    buttonContent = (
      <>
        <Upload className="size-5" />
        <span>Choose File</span>
      </>
    );
  }

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
          <div className="flex flex-col gap-2">
            <div
              className={cn(
                "flex items-center gap-3 p-4 rounded-md border",
                "bg-card",
                "transition-colors duration-150 ease-out",
                uploadSuccess && "border-green-500/50 bg-green-500/5"
              )}
            >
              <div className="shrink-0">
                <div className="size-10 rounded-md bg-primary/10 flex items-center justify-center">
                  {uploadSuccess ? (
                    <CheckCircle2 className="size-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <FileAudio className="size-5 text-primary" />
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{value.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(value.fileSize)} •{" "}
                  {value.format.toUpperCase()}
                  {uploadSuccess && (
                    <span className="ml-2 text-green-600 dark:text-green-400">
                      • Uploaded
                    </span>
                  )}
                </p>
              </div>

              {!isUploading && (
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
              )}

              {isUploading && (
                <div className="shrink-0">
                  <Loader2 className="size-5 animate-spin text-primary" />
                </div>
              )}
            </div>

            {/* Manual upload button (if auto-upload is disabled) */}
            {!autoUpload && onUpload && !isUploading && !uploadSuccess && (
              <Button
                type="button"
                onClick={handleManualUpload}
                disabled={disabled}
                className="w-full"
              >
                Upload Voice
              </Button>
            )}

            {/* Retry button on error */}
            {uploadError && onUpload && !isUploading && (
              <Button
                type="button"
                variant="outline"
                onClick={handleManualUpload}
                disabled={disabled}
                className="w-full"
              >
                Retry Upload
              </Button>
            )}
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
            {buttonContent}
          </Button>
        )}
      </div>

      {/* Error message */}
      {displayError && (
        <div className="flex items-start gap-2 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <span>{displayError}</span>
        </div>
      )}
    </Field>
  );
}
