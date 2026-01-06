"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/libs/tailwind/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";

export interface ComboboxOption {
  id?: string;
  value: string;
  label: string;
}

export interface ComboboxProps {
  readonly options: ComboboxOption[];
  readonly value?: string;
  readonly onValueChange?: (value: string) => void;
  readonly placeholder?: string;
  readonly searchPlaceholder?: string;
  readonly emptyText?: string;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly allowClear?: boolean;
  readonly triggerClassName?: string;
  readonly popoverClassName?: string;
  readonly searchValue?: string;
  readonly onSearchChange?: (search: string) => void;
  readonly isLoading?: boolean;
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No option found.",
  className,
  disabled = false,
  allowClear = false,
  triggerClassName,
  popoverClassName,
  searchValue,
  onSearchChange,
  isLoading = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState("");
  const [internalSearchValue, setInternalSearchValue] = React.useState("");

  // Use controlled value if provided, otherwise use internal state
  const currentValue = value ?? internalValue;
  const setValue = React.useCallback(
    (newValue: string) => {
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [value, onValueChange]
  );

  const selectedOption = options.find(
    (option) => option.value === currentValue
  );

  const handleSelect = (selectedValue: string) => {
    // The Command component passes the value directly, so we can use it as-is
    const newValue = selectedValue === currentValue ? "" : selectedValue;
    setValue(newValue);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue("");
  };

  // Handle controlled vs uncontrolled search value
  const currentSearchValue = searchValue ?? internalSearchValue;

  const handleSearchChange = (search: string) => {
    if (searchValue === undefined) {
      setInternalSearchValue(search);
    }
    onSearchChange?.(search);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            !currentValue && "text-muted-foreground",
            triggerClassName
          )}
        >
          <span className="truncate">
            {selectedOption?.label ?? placeholder}
          </span>
          <div className="flex items-center gap-1">
            {allowClear && currentValue && (
              <X
                className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
                onClick={handleClear}
              />
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-[var(--radix-popover-trigger-width)] p-0",
          popoverClassName
        )}
        align="start"
      >
        <Command className={className} shouldFilter={!searchValue}>
          <CommandInput
            value={currentSearchValue}
            onValueChange={handleSearchChange}
            placeholder={searchPlaceholder}
            className="h-9"
          />
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                <Spinner className="h-4 w-4" />
                <span>Loading...</span>
              </div>
            ) : (
              <>
                <CommandEmpty>{emptyText}</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.id ?? option.value}
                      value={option.value}
                      onSelect={handleSelect}
                    >
                      {option.label}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          currentValue === option.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
