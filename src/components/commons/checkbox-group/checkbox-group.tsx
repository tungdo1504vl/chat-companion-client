'use client';

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/libs/tailwind/utils';

export interface CheckboxGroupItemProps {
  value: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  id?: string;
}

export const CheckboxGroupItem = React.forwardRef<
  HTMLButtonElement,
  CheckboxGroupItemProps
>(
  (
    { children, value, checked, onCheckedChange, disabled, id, ...props },
    ref
  ) => {
    const itemId = id || `checkbox-${value}`;

    return (
      <div className="flex-1">
        <Checkbox
          ref={ref}
          id={itemId}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />
        <Label
          htmlFor={itemId}
          className={cn(
            'flex items-center justify-center px-6 py-2.5 rounded-full border-2 cursor-pointer transition-all',
            'peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:border-primary/10 peer-data-[state=checked]:text-primary',
            'peer-data-[state=unchecked]:bg-transparent peer-data-[state=unchecked]:border-transparent',
            'hover:border-primary',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {children}
        </Label>
      </div>
    );
  }
);

CheckboxGroupItem.displayName = 'CheckboxGroupItem';

export interface CheckboxGroupProps {
  value?: string[];
  onValueChange?: (value: string[]) => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const CheckboxGroup = React.forwardRef<
  HTMLDivElement,
  CheckboxGroupProps
>(
  (
    { value = [], onValueChange, disabled, className, children, ...props },
    ref
  ) => {
    const handleCheckedChange = (itemValue: string, checked: boolean) => {
      if (!onValueChange) return;

      if (checked) {
        onValueChange([...value, itemValue]);
      } else {
        onValueChange(value.filter((v) => v !== itemValue));
      }
    };

    return (
      <div
        ref={ref}
        className={cn('flex flex-wrap gap-2', className)}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement<CheckboxGroupItemProps>(child)) {
            const itemValue = child.props.value;
            const isChecked = value.includes(itemValue);

            return React.cloneElement(child, {
              checked: isChecked,
              onCheckedChange: (checked: boolean) =>
                handleCheckedChange(itemValue, checked),
              disabled: disabled || child.props.disabled,
            });
          }
          return child;
        })}
      </div>
    );
  }
);

CheckboxGroup.displayName = 'CheckboxGroup';
