import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/libs/tailwind/utils"

const chipVariants = cva(
  "inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-transform active:scale-95 ring-2 ring-transparent focus:outline-none",
  {
    variants: {
      selected: {
        true: "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg shadow-gray-200/50 dark:shadow-none",
        false: "bg-white dark:bg-card-dark text-gray-500 dark:text-gray-400 shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700",
      },
    },
    defaultVariants: {
      selected: false,
    },
  }
)

export interface ChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof chipVariants> {
  icon?: React.ReactNode
  children: React.ReactNode
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, selected, icon, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(chipVariants({ selected }), className)}
        {...props}
      >
        {icon && <span>{icon}</span>}
        <span>{children}</span>
      </button>
    )
  }
)
Chip.displayName = "Chip"

export { Chip, chipVariants }
