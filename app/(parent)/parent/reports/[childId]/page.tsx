import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { StatTile } from "@/components/reports/stat-tile"
import { ScoreTrendChart } from "@/components/reports/score-trend-chart"
import { SubjectBreakdownChart } from "@/components/reports/subject-breakdown-chart"
import { EmptyState } from "@/components/empty-state"

export default async function ChildReportPage({
  params,
}: {
  params: Promise<{ childId: string }>
}) {
  const { childId } = await params
  const supabase = await createClient()

  const [{ data: child }, { data: attempts }, { data: planItems }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("full_name, grade, curricula(name)")
        .eq("id", childId)
        .single(),
      supabase
        .from("quiz_attempts")
        .select("score, total, completed_at, quizzes(subjects(name))")
        .eq("student_id", childId)
        .order("completed_at"),
      supabase
        .from("study_plan_items")
        .select("duration_minutes, completed")
        .eq("student_id", childId),
    ])

  // RLS returns null here if this parent has no link to this student.
  if (!child) {
    notFound()
  }

  const studyMinutes = (planItems ?? [])
    .filter((item) => item.completed)
    .reduce((sum, item) => sum + (item.duration_minutes ?? 0), 0)

  const hasAttempts = attempts && attempts.length > 0
  let averageScore = 0
  let weakestSubject = "—"
  let subjectData: { subject: string; scorePercent: number }[] = []
  let trendData: { label: string; scorePercent: number }[] = []

  if (hasAttempts) {
    const scorePercents = attempts.map((a) => Math.round((a.score / a.total) * 100))
    averageScore = Math.round(
      scorePercents.reduce((sum, v) => sum + v, 0) / scorePercents.length
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
    subjectData = Array.from(bySubject.entries()).map(([subject, stats]) => ({
      subject,
      scorePercent: Math.round(stats.total / stats.count),
    }))
    weakestSubject = subjectData.reduce((weakest, current) =>
      current.scorePercent < weakest.scorePercent ? current : weakest
    ).subject

    trendData = attempts.map((attempt, index) => ({
      label: `#${index + 1}`,
      scorePercent: Math.round((attempt.score / attempt.total) * 100),
    }))
  }

  return (
    <div className="flex flex-1 flex-col gap-8 px-6 py-10 sm:px-10">
      <div>
        <span className="text-sm font-medium text-role-parent">Parent</span>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {child.full_name}&apos;s progress
        </h1>
        <p className="mt-1 text-muted-foreground">
          {child.curricula?.name ?? "Curriculum not set"}
          {child.grade ? ` · Grade ${child.grade}` : ""}
        </p>
      </div>

      {hasAttempts ? (
        <>
          <div className="grid gap-4 sm:grid-cols-4">
            <StatTile label="Average score" value={`${averageScore}%`} />
            <StatTile label="Quizzes taken" value={String(attempts.length)} />
            <StatTile
              label="Study time logged"
              value={`${Math.floor(studyMinutes / 60)}h ${studyMinutes % 60}m`}
            />
            <StatTile label="Needs attention" value={weakestSubject} />
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
        </>
      ) : (
        <EmptyState message={`${child.full_name} hasn't taken any practice quizzes yet.`} />
      )}
    </div>
  )
}
