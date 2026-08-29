import Link from "next/link"
import {
  BarChart3,
  CalendarClock,
  ClipboardCheck,
  Compass,
  Flame,
  MessageCircle,
  UserRound,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { StatTile } from "@/components/reports/stat-tile"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/empty-state"
import { AchievementBadges } from "@/components/gamification/achievement-badges"
import { computeAchievements, computeStreak } from "@/lib/gamification"

const QUICK_LINKS = [
  { href: "/assistant", label: "AI Assistant", icon: MessageCircle },
  { href: "/planner", label: "Study Planner", icon: CalendarClock },
  { href: "/tests", label: "Tests", icon: ClipboardCheck },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: UserRound },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: profile }, { data: attempts }, { data: xpEvents }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("full_name, grade, curricula(name)")
        .eq("id", user!.id)
        .single(),
      supabase
        .from("quiz_attempts")
        .select("score, total, completed_at, quizzes(title)")
        .eq("student_id", user!.id)
        .order("completed_at", { ascending: false }),
      supabase
        .from("xp_events")
        .select("amount, created_at")
        .eq("student_id", user!.id),
    ])

  const quickLinks =
    profile && profile.grade && profile.grade >= 11
      ? [...QUICK_LINKS, { href: "/career-compass", label: "Career Compass", icon: Compass }]
      : QUICK_LINKS

  const scorePercents = (attempts ?? []).map((a) => (a.score / a.total) * 100)
  const averageScore =
    scorePercents.length > 0
      ? Math.round(scorePercents.reduce((sum, v) => sum + v, 0) / scorePercents.length)
      : null
  const bestScorePercent = scorePercents.length > 0 ? Math.max(...scorePercents) : 0

  const totalXp = (xpEvents ?? []).reduce((sum, e) => sum + e.amount, 0)
  const streak = computeStreak((xpEvents ?? []).map((e) => e.created_at))
  const achievements = computeAchievements({
    quizCount: attempts?.length ?? 0,
    bestScorePercent,
    streak,
    xpEventCount: xpEvents?.length ?? 0,
  })

  const recentAttempts = (attempts ?? []).slice(0, 3)

  return (
    <div className="flex flex-1 flex-col gap-10 px-6 py-10 sm:px-10">
      <div>
        <span className="text-sm font-medium text-brand">Student</span>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Welcome back, {profile?.full_name?.split(" ")[0] ?? "there"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {profile?.curricula?.name ?? "Your curriculum"}
          {profile?.grade ? ` · Grade ${profile.grade}` : ""}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {quickLinks.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <Card className="transition-colors hover:bg-muted">
              <CardContent className="flex flex-col items-center gap-2 text-center">
                <Icon className="size-5 text-brand" />
                <span className="text-sm font-medium text-foreground">
                  {label}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatTile label="Study streak" value={`${streak} day${streak === 1 ? "" : "s"}`} />
        <StatTile label="Total XP" value={String(totalXp)} />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-muted-foreground">
          Achievements
        </h2>
        <AchievementBadges achievements={achievements} />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">
            Performance snapshot
          </h2>
          <Link href="/reports" className="text-sm text-brand hover:underline">
            View full report
          </Link>
        </div>
        {averageScore !== null ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <StatTile label="Average score" value={`${averageScore}%`} />
            <StatTile label="Quizzes taken" value={String(attempts?.length ?? 0)} />
          </div>
        ) : (
          <EmptyState
            message="Take your first practice quiz to see your performance here."
            action={
              <Link href="/tests" className="text-sm font-medium text-brand hover:underline">
                Start a quiz
              </Link>
            }
          />
        )}
      </div>

      {recentAttempts.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-medium text-muted-foreground">
            Recent quizzes
          </h2>
          <ul className="flex flex-col gap-2">
            {recentAttempts.map((attempt, index) => (
              <li
                key={index}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
              >
                <span className="text-sm font-medium text-foreground">
                  {attempt.quizzes?.title ?? "Quiz"}
                </span>
                <span className="text-sm text-muted-foreground">
                  {attempt.score}/{attempt.total} ·{" "}
                  {new Date(attempt.completed_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Card>
        <CardContent className="flex items-center gap-3">
          <Flame className="size-5 text-streak" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Keep your streak alive
            </p>
            <p className="text-sm text-muted-foreground">
              Ask the assistant a question, complete a study task, or take a
              quiz today to keep your streak going.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
