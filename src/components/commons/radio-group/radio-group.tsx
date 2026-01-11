'use client';

import React from 'react';
import {
  RadioGroup as UIRadioGroup,
  RadioGroupItem as UIRadioGroupItem,
} from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/libs/tailwind/utils';

// Re-export RadioGroup for convenience
export { UIRadioGroup as RadioGroup };

// Enhanced RadioGroupItem with children support and styling
export interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof UIRadioGroupItem> {
  children?: React.ReactNode;
}

export const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof UIRadioGroupItem>,
  RadioGroupItemProps
>(({ children, value, className, id, ...props }, ref) => {
  const itemId = id || `radio-${value}`;

  return (
    <div>
      <UIRadioGroupItem
        ref={ref}
        value={value}
        id={itemId}
        className={cn('sr-only peer', className)}
        {...props}
      />
      <Label
        htmlFor={itemId}
        className="flex items-center justify-center px-6 py-2.5 rounded-full border-2 cursor-pointer transition-colors duration-[120ms] ease-out whitespace-nowrap
                 peer-data-[state=checked]:bg-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary-foreground
                 peer-data-[state=unchecked]:bg-transparent peer-data-[state=unchecked]:border-gray-300 peer-data-[state=unchecked]:text-foreground
                 hover:border-primary"
      >
        {children}
      </Label>
    </div>
  );
});

RadioGroupItem.displayName = 'RadioGroupItem';
