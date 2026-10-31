import { Star } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { EmptyState } from "@/components/empty-state"
import { cn } from "@/lib/utils"

const ROLE_LABELS: Record<string, string> = {
  student: "Student",
  parent: "Parent",
  teacher: "Teacher",
}

export default async function AdminFeedbackPage() {
  const supabase = await createClient()

  const { data: feedback } = await supabase
    .from("feedback")
    .select("id, message, rating, page_path, role, created_at, profiles(full_name)")
    .order("created_at", { ascending: false })

  return (
    <div className="flex flex-1 flex-col gap-8 px-6 py-10 sm:px-10">
      <div>
        <span className="text-sm font-medium text-brand">Admin</span>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Feedback
        </h1>
        <p className="mt-1 text-muted-foreground">
          What students, parents, and teachers are saying about Learnova.
        </p>
      </div>

      {feedback && feedback.length > 0 ? (
        <div className="flex flex-col gap-4">
          {feedback.map((entry) => (
            <div
              key={entry.id}
              className="flex flex-col gap-2 rounded-lg border border-border p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {entry.profiles?.full_name ?? "Unknown"}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {ROLE_LABELS[entry.role] ?? entry.role}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(entry.created_at).toLocaleString()}
                </span>
              </div>
              {entry.rating && (
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                      key={value}
                      className={cn(
                        "size-3.5",
                        value <= entry.rating!
                          ? "fill-xp text-xp"
                          : "text-muted-foreground"
                      )}
                    />
                  ))}
                </div>
              )}
              <p className="text-sm text-foreground">{entry.message}</p>
              {entry.page_path && (
                <span className="text-xs text-muted-foreground">
                  Sent from {entry.page_path}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message="No feedback yet — it'll show up here as people submit it from the app." />
      )}
    </div>
  )
}
