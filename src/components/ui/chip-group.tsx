"use client"

import * as React from "react"
import { cn } from "@/libs/tailwind/utils"
import { Chip } from "./chip"

export interface ChipOption {
  value: string
  label: string
  icon?: React.ReactNode
}

export interface ChipGroupProps {
  options: ChipOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  className?: string
}

const ChipGroup = React.forwardRef<HTMLDivElement, ChipGroupProps>(
  ({ options, value, defaultValue, onValueChange, className }, ref) => {
    const [internalValue, setInternalValue] = React.useState(
      defaultValue || value || options[0]?.value
    )

    const currentValue = value ?? internalValue

    const handleChange = (optionValue: string) => {
      if (!value) {
        setInternalValue(optionValue)
      }
      onValueChange?.(optionValue)
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center space-x-3 mb-8 overflow-x-auto no-scrollbar pb-1",
          className
        )}
      >
        {options.map((option) => (
          <Chip
            key={option.value}
            selected={currentValue === option.value}
            icon={option.icon}
            onClick={() => handleChange(option.value)}
          >
            {option.label}
          </Chip>
        ))}
      </div>
    )
  }
)
ChipGroup.displayName = "ChipGroup"

export { ChipGroup }
