import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  message: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ message, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-lg border border-dashed border-border px-6 py-10 text-center",
        className
      )}
    >
      <p className="text-muted-foreground">{message}</p>
      {action}
    </div>
  )
}
