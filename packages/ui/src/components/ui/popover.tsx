/**
 * Popover Component
 * Overlay content positioned relative to an element
 */

import * as React from "react"
import { cn } from "../../lib/utils"

const Popover = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative">{children}</div>
}

const PopoverTrigger = ({ asChild, children }: { asChild?: boolean; children: React.ReactNode }) => {
  return <>{children}</>
}

const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { 
    align?: "start" | "center" | "end"
    side?: "top" | "right" | "bottom" | "left"
  }
>(({ className, align = "center", side = "bottom", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      {
        "top-0 left-0": side === "top" && align === "start",
        "top-0 left-1/2 -translate-x-1/2": side === "top" && align === "center",
        "top-0 right-0": side === "top" && align === "end",
        "top-1/2 left-0 -translate-y-1/2": side === "left" && align === "start",
        "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2": side === "left" && align === "center",
        "top-1/2 right-0 -translate-y-1/2": side === "left" && align === "end",
        "bottom-0 left-0": side === "bottom" && align === "start",
        "bottom-0 left-1/2 -translate-x-1/2": side === "bottom" && align === "center",
        "bottom-0 right-0": side === "bottom" && align === "end",
        "top-0 left-1/2 -translate-x-1/2 -translate-y-full": side === "top" && align === "center",
        "top-0 right-0 -translate-y-full": side === "top" && align === "end",
        "top-0 left-0 -translate-x-full": side === "left" && align === "start",
        "bottom-0 left-0 translate-y-full": side === "bottom" && align === "start",
        "bottom-0 left-1/2 -translate-x-1/2 translate-y-full": side === "bottom" && align === "center",
        "bottom-0 right-0 translate-y-full": side === "bottom" && align === "end",
      },
      className
    )}
    {...props}
  />
))
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }