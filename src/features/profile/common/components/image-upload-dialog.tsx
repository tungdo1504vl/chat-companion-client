"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { validateImageFile, formatFileSize } from "@/utils/image";
import { cn } from "@/libs/tailwind/utils";

export interface ImageUploadDialogProps {
  /**
   * Whether the dialog is open
   */
  open: boolean;
  /**
   * Callback when dialog should close
   */
  onOpenChange: (open: boolean) => void;
  /**
   * Callback when image is selected and validated
   * Receives the image file
   */
  onImageSelect: (file: File) => void;
  /**
   * Whether upload is in progress
   */
  isUploading?: boolean;
  /**
   * Current avatar URL for preview (optional)
   */
  currentAvatarUrl?: string;
}

export function ImageUploadDialog({
  open,
  onOpenChange,
  onImageSelect,
  isUploading = false,
  currentAvatarUrl,
}: Readonly<ImageUploadDialogProps>) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = useCallback(
    (file: File) => {
      setValidationError(null);

      // Validate file
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setValidationError(validation.error || "Invalid image file");
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }

      // Set file and create preview
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  // Handle file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle upload
  const handleUpload = () => {
    if (selectedFile && !validationError) {
      onImageSelect(selectedFile);
    }
  };

  // Handle cancel/close
  const handleClose = () => {
    if (!isUploading) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setValidationError(null);
      setIsDragging(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onOpenChange(false);
    }
  };

  // Reset when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isUploading) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setValidationError(null);
      setIsDragging(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
    onOpenChange(newOpen);
  };

  const displayPreview = previewUrl || currentAvatarUrl;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Profile Image</DialogTitle>
          <DialogDescription>
            Upload a JPG or PNG image. Maximum file size is 2MB.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Input Area */}
          <Label
            htmlFor="image-upload"
            className={cn(
              "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 bg-muted/30",
              validationError && "border-destructive"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {displayPreview ? (
              <div className="relative w-full">
                <div className="relative mx-auto aspect-square w-48 overflow-hidden rounded-full border-2 border-border">
                  <img
                    src={displayPreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  {selectedFile && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <span className="text-sm font-medium text-white">
                        Preview
                      </span>
                    </div>
                  )}
                </div>
                {selectedFile && (
                  <div className="mt-4 text-center text-sm text-muted-foreground">
                    <p className="font-medium">{selectedFile.name}</p>
                    <p>{formatFileSize(selectedFile.size)}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-muted p-4">
                  <Upload className="size-8 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <span className="text-sm font-medium text-primary">
                    Click to upload
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    or drag and drop
                  </p>
                </div>
              </div>
            )}

            <Input
              ref={fileInputRef}
              id="image-upload"
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleInputChange}
              className="absolute inset-0 cursor-pointer opacity-0"
              disabled={isUploading}
              aria-label="Upload profile image"
            />
          </Label>

          {/* Validation Error */}
          {validationError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {validationError}
            </div>
          )}

          {/* File Info */}
          {selectedFile && !validationError && (
            <div className="rounded-md bg-muted/50 p-3 text-sm">
              <p className="font-medium">Selected file:</p>
              <p className="text-muted-foreground">{selectedFile.name}</p>
              <p className="text-muted-foreground">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || !!validationError || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
