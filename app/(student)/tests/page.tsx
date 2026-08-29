import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/empty-state"
import { StartQuizButton } from "@/components/tests/start-quiz-button"
import { createQuiz } from "@/app/(student)/tests/actions"

export default async function TestsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("curriculum_id")
    .eq("id", user!.id)
    .single()

  const [{ data: subjects }, { data: attempts }] = await Promise.all([
    profile?.curriculum_id
      ? supabase
          .from("subjects")
          .select("id, name")
          .eq("curriculum_id", profile.curriculum_id)
          .order("name")
      : Promise.resolve({ data: [] }),
    supabase
      .from("quiz_attempts")
      .select("id, quiz_id, score, total, completed_at, quizzes(title)")
      .eq("student_id", user!.id)
      .order("completed_at", { ascending: false })
      .limit(5),
  ])

  return (
    <div className="flex flex-1 flex-col gap-10 px-6 py-10 sm:px-10">
      <div>
        <span className="text-sm font-medium text-brand">Student</span>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Tests & Quizzes
        </h1>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-muted-foreground">
          Start a practice quiz
        </h2>
        {subjects && subjects.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <Card key={subject.id}>
                <CardContent className="flex flex-col gap-3">
                  <span className="font-medium text-foreground">
                    {subject.name}
                  </span>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <form action={createQuiz} className="flex-1">
                      <input type="hidden" name="subjectId" value={subject.id} />
                      <input type="hidden" name="quizType" value="mcq" />
                      <StartQuizButton label="Multiple choice" />
                    </form>
                    <form action={createQuiz} className="flex-1">
                      <input type="hidden" name="subjectId" value={subject.id} />
                      <input type="hidden" name="quizType" value="written" />
                      <StartQuizButton label="Written answer" />
                    </form>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Finish setting up your curriculum in your profile to see subjects.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-muted-foreground">
          Recent attempts
        </h2>
        {attempts && attempts.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {attempts.map((attempt) => (
              <li key={attempt.id}>
                <Link
                  href={`/tests/${attempt.quiz_id}/results`}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3 hover:bg-muted"
                >
                  <span className="text-sm font-medium text-foreground">
                    {attempt.quizzes?.title ?? "Quiz"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {attempt.score}/{attempt.total} ·{" "}
                    {new Date(attempt.completed_at).toLocaleDateString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message="No quizzes taken yet." />
        )}
      </div>
    </div>
  )
}
