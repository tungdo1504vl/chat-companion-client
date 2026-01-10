'use client';

import { cn } from '@/libs/tailwind/utils';
import { Button } from '@/components/ui/button';

export interface PillButtonOption<T = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

interface PillButtonGroupProps<T = string> {
  options: PillButtonOption<T>[];
  value?: T | T[];
  onValueChange?: (value: T | T[]) => void;
  multiple?: boolean;
  className?: string;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
}

export function PillButtonGroup<T extends string | number = string>({
  options,
  value,
  onValueChange,
  multiple = false,
  className,
  variant = 'default',
  disabled = false,
}: PillButtonGroupProps<T>) {
  const isSelected = (optionValue: T): boolean => {
    if (multiple && Array.isArray(value)) {
      return value.includes(optionValue);
    }
    return value === optionValue;
  };

  const handleClick = (optionValue: T) => {
    if (disabled || !onValueChange) return;

    if (multiple) {
      const currentValues = (Array.isArray(value) ? value : []) as T[];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];
      onValueChange(newValues);
    } else {
      onValueChange(optionValue);
    }
  };

  return (
    <div
      className={cn(
        'flex flex-wrap gap-2',
        className
      )}
    >
      {options.map((option) => {
        const selected = isSelected(option.value);
        return (
          <Button
            key={String(option.value)}
            type="button"
            variant={selected ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleClick(option.value)}
            disabled={disabled}
            className={cn(
              'rounded-full',
              variant === 'destructive' && selected
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : '',
              !selected && variant === 'destructive'
                ? 'border-destructive text-destructive hover:bg-destructive/10'
                : ''
            )}
          >
            {option.icon && <span className="mr-1">{option.icon}</span>}
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}

