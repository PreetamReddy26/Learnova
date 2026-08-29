"use client"

import { useTransition } from "react"
import { Check } from "lucide-react"
import { togglePlanItem } from "@/app/(student)/planner/actions"
import { cn } from "@/lib/utils"

interface PlanItemRowProps {
  id: string
  title: string
  completed: boolean
  durationMinutes: number | null
}

export function PlanItemRow({
  id,
  title,
  completed,
  durationMinutes,
}: PlanItemRowProps) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => togglePlanItem(id, !completed))}
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border",
          completed
            ? "border-brand bg-brand text-primary-foreground"
            : "border-input"
        )}
      >
        {completed && <Check className="size-3.5" />}
      </button>
      <span
        className={cn(
          "flex-1 text-sm",
          completed ? "text-muted-foreground line-through" : "text-foreground"
        )}
      >
        {title}
      </span>
      {durationMinutes && (
        <span className="text-xs text-muted-foreground">
          {durationMinutes} min
        </span>
      )}
    </div>
  )
}
