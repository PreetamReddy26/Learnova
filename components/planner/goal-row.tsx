"use client"

import { useTransition } from "react"
import { incrementGoal } from "@/app/(student)/planner/actions"
import { Button } from "@/components/ui/button"

interface GoalRowProps {
  id: string
  title: string
  currentCount: number
  targetCount: number
}

export function GoalRow({ id, title, currentCount, targetCount }: GoalRowProps) {
  const [isPending, startTransition] = useTransition()
  const percent = Math.min(100, Math.round((currentCount / targetCount) * 100))
  const isComplete = currentCount >= targetCount

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border px-4 py-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{title}</span>
        <span className="text-xs text-muted-foreground">
          {currentCount}/{targetCount}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-brand" style={{ width: `${percent}%` }} />
      </div>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={isComplete || isPending}
        onClick={() => startTransition(() => incrementGoal(id))}
        className="self-start"
      >
        {isComplete ? "Complete" : "Log progress +1"}
      </Button>
    </div>
  )
}
