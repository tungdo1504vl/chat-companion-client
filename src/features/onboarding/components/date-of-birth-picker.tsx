"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/libs/tailwind/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export interface DateOfBirthPickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  onBlur?: () => void;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export function DateOfBirthPicker({
  value,
  onChange,
  onBlur,
  disabled,
  error,
  className,
}: DateOfBirthPickerProps) {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const handleSelect = (date: Date | undefined) => {
    onChange?.(date);
    if (date && !isMobile) {
      // Close popover on desktop after selection
      setOpen(false);
    }
  };

  const handleMobileConfirm = () => {
    setOpen(false);
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return "Select your date of birth";
    return format(date, "MMMM d, yyyy");
  };

  const calendarProps = {
    mode: "single" as const,
    selected: value,
    onSelect: handleSelect,
    disabled: disabled,
    defaultMonth: value || new Date(2000, 0, 1),
    captionLayout: "dropdown" as const,
    fromYear: 1900,
    toYear: new Date().getFullYear(),
    className: isMobile ? "w-full" : undefined,
  };

  const handleBlur = () => {
    onBlur?.();
  };

  // Mobile: Use Sheet
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          handleBlur();
        }
      }}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            onBlur={handleBlur}
            className={cn(
              "w-full justify-start text-left font-normal h-10",
              !value && "text-muted-foreground",
              error && "border-destructive",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDate(value)}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh]">
          <SheetHeader>
            <SheetTitle>Select Date of Birth</SheetTitle>
          </SheetHeader>
          <div className="mt-6 flex flex-col gap-4">
            <Calendar {...calendarProps} />
            {value && (
              <Button onClick={handleMobileConfirm} className="w-full">
                Confirm Selection
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Use Popover
  return (
    <Popover open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        handleBlur();
      }
    }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          onBlur={handleBlur}
          className={cn(
            "w-full justify-start text-left font-normal h-10",
            !value && "text-muted-foreground",
            error && "border-destructive",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDate(value)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar {...calendarProps} />
      </PopoverContent>
    </Popover>
  );
}
