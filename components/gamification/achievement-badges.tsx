import { Award } from "lucide-react"
import type { Achievement } from "@/lib/gamification"
import { cn } from "@/lib/utils"

export function AchievementBadges({
  achievements,
}: {
  achievements: Achievement[]
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {achievements.map((achievement) => (
        <div
          key={achievement.code}
          className={cn(
            "flex flex-col items-center gap-2 rounded-lg border px-3 py-4 text-center",
            achievement.earned
              ? "border-xp/40 bg-xp/10"
              : "border-border opacity-50"
          )}
        >
          <Award
            className={cn(
              "size-6",
              achievement.earned ? "text-xp" : "text-muted-foreground"
            )}
          />
          <span className="text-xs font-medium text-foreground">
            {achievement.title}
          </span>
          <span className="text-xs text-muted-foreground">
            {achievement.description}
          </span>
        </div>
      ))}
    </div>
  )
}
