"use client"

import { useActionState, useState } from "react"
import { usePathname } from "next/navigation"
import { MessageSquarePlus, Star, X } from "lucide-react"
import { submitFeedback } from "@/app/actions/feedback"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export function FeedbackWidget() {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [state, action, pending] = useActionState(submitFeedback, undefined)
  const pathname = usePathname()

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg hover:opacity-90"
      >
        <MessageSquarePlus className="size-4" />
        Feedback
      </button>
    )
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 w-80 rounded-xl border border-border bg-card p-4 shadow-xl">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          Share your feedback
        </span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close feedback form"
        >
          <X className="size-4 text-muted-foreground hover:text-foreground" />
        </button>
      </div>

      {state?.success ? (
        <div className="mt-3 flex flex-col items-center gap-3 py-4 text-center">
          <p className="text-sm text-foreground">
            Thanks — this really helps us improve Learnova.
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </div>
      ) : (
        <form action={action} className="mt-3 flex flex-col gap-3">
          <input type="hidden" name="pagePath" value={pathname} />
          <input type="hidden" name="rating" value={rating || ""} />
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                aria-label={`Rate ${value} out of 5`}
              >
                <Star
                  className={cn(
                    "size-5",
                    value <= rating ? "fill-xp text-xp" : "text-muted-foreground"
                  )}
                />
              </button>
            ))}
          </div>
          <Textarea
            name="message"
            placeholder="What's working, what's not — anything helps."
            className="min-h-20"
            required
          />
          {state?.message && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Sending…" : "Send feedback"}
          </Button>
        </form>
      )}
    </div>
  )
}
