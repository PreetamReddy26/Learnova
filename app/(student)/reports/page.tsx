import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { StatTile } from "@/components/reports/stat-tile"
import { ScoreTrendChart } from "@/components/reports/score-trend-chart"
import { SubjectBreakdownChart } from "@/components/reports/subject-breakdown-chart"
import { EmptyState } from "@/components/empty-state"

export default async function ReportsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: attempts } = await supabase
    .from("quiz_attempts")
    .select("score, total, completed_at, quizzes(subjects(name))")
    .eq("student_id", user!.id)
    .order("completed_at")

  if (!attempts || attempts.length === 0) {
    return (
      <div className="flex flex-1 flex-col gap-2 px-6 py-10 sm:px-10">
        <span className="text-sm font-medium text-brand">Student</span>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Reports
        </h1>
        <EmptyState
          className="mt-4"
          message="Take your first quiz to start building your performance report."
          action={
            <Link href="/tests" className="text-sm font-medium text-brand hover:underline">
              Start a quiz
            </Link>
          }
        />
      </div>
    )
  }

  const scorePercents = attempts.map((a) => Math.round((a.score / a.total) * 100))
  const averageScore = Math.round(
    scorePercents.reduce((sum, value) => sum + value, 0) / scorePercents.length
  )

  const bySubject = new Map<string, { total: number; count: number }>()
  for (const attempt of attempts) {
    const subjectName = attempt.quizzes?.subjects?.name ?? "General"
    const percent = Math.round((attempt.score / attempt.total) * 100)
    const existing = bySubject.get(subjectName) ?? { total: 0, count: 0 }
    bySubject.set(subjectName, {
      total: existing.total + percent,
      count: existing.count + 1,
    })
  }

  const subjectData = Array.from(bySubject.entries()).map(([subject, stats]) => ({
    subject,
    scorePercent: Math.round(stats.total / stats.count),
  }))

  const bestSubject = subjectData.reduce((best, current) =>
    current.scorePercent > best.scorePercent ? current : best
  )

  const trendData = attempts.map((attempt, index) => ({
    label: `#${index + 1}`,
    scorePercent: Math.round((attempt.score / attempt.total) * 100),
  }))

  return (
    <div className="flex flex-1 flex-col gap-8 px-6 py-10 sm:px-10">
      <div>
        <span className="text-sm font-medium text-brand">Student</span>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Reports
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Average score" value={`${averageScore}%`} />
        <StatTile label="Quizzes completed" value={String(attempts.length)} />
        <StatTile label="Strongest subject" value={bestSubject.subject} />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Score trend
        </h2>
        <ScoreTrendChart data={trendData} />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Performance by subject
        </h2>
        <SubjectBreakdownChart data={subjectData} />
      </div>
    </div>
  )
}
