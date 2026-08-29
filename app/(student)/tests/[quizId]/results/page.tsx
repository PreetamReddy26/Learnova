import { notFound } from "next/navigation"
import { Check, X } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"

interface WrittenAnswerRecord {
  text: string
  score: number
  feedback: string
}

export default async function QuizResultsPage({
  params,
}: {
  params: Promise<{ quizId: string }>
}) {
  const { quizId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: quiz }, { data: questions }, { data: attempt }] =
    await Promise.all([
      supabase.from("quizzes").select("title, quiz_type").eq("id", quizId).single(),
      supabase
        .from("quiz_questions")
        .select("id, prompt, choices, correct_index, explanation, model_answer")
        .eq("quiz_id", quizId)
        .order("position"),
      supabase
        .from("quiz_attempts")
        .select("score, total, answers")
        .eq("quiz_id", quizId)
        .eq("student_id", user!.id)
        .order("completed_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ])

  if (!quiz || !questions || !attempt) {
    notFound()
  }

  const isWritten = quiz.quiz_type === "written"

  return (
    <div className="flex flex-1 flex-col gap-8 px-6 py-10 sm:px-10">
      <div>
        <span className="text-sm font-medium text-brand">Student</span>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {quiz.title} — results
        </h1>
        <p className="mt-1 text-lg text-foreground">
          Score: <span className="font-semibold">{attempt.score}</span> /{" "}
          {attempt.total}
        </p>
      </div>

      {isWritten ? (
        <div className="flex flex-col gap-6">
          {questions.map((question, index) => {
            const answers = attempt.answers as unknown as Record<
              string,
              WrittenAnswerRecord
            >
            const answer = answers[question.id]
            const isCorrect = answer?.score === 1

            return (
              <div key={question.id} className="flex flex-col gap-3">
                <div className="flex items-start gap-2">
                  {isCorrect ? (
                    <Check className="mt-0.5 size-4 shrink-0 text-success" />
                  ) : (
                    <X className="mt-0.5 size-4 shrink-0 text-destructive" />
                  )}
                  <p className="font-medium text-foreground">
                    {index + 1}. {question.prompt}
                  </p>
                </div>
                <div className="flex flex-col gap-2 pl-6">
                  <div className="rounded-lg border border-border px-3 py-2 text-sm text-foreground">
                    <span className="text-xs font-medium text-muted-foreground">
                      Your answer
                    </span>
                    <p>{answer?.text || "No answer submitted."}</p>
                  </div>
                  <div className="rounded-lg border border-success/40 bg-success/5 px-3 py-2 text-sm text-foreground">
                    <span className="text-xs font-medium text-muted-foreground">
                      Model answer
                    </span>
                    <p>{question.model_answer}</p>
                  </div>
                </div>
                <p className="pl-6 text-sm text-muted-foreground">
                  {answer?.feedback}
                </p>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {questions.map((question, index) => {
            const answers = attempt.answers as Record<string, number>
            const choices = question.choices as string[]
            const studentAnswer = answers[question.id]
            const isCorrect = studentAnswer === question.correct_index

            return (
              <div key={question.id} className="flex flex-col gap-3">
                <div className="flex items-start gap-2">
                  {isCorrect ? (
                    <Check className="mt-0.5 size-4 shrink-0 text-success" />
                  ) : (
                    <X className="mt-0.5 size-4 shrink-0 text-destructive" />
                  )}
                  <p className="font-medium text-foreground">
                    {index + 1}. {question.prompt}
                  </p>
                </div>
                <div className="flex flex-col gap-2 pl-6">
                  {choices.map((choice, choiceIndex) => (
                    <div
                      key={choiceIndex}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-sm",
                        choiceIndex === question.correct_index
                          ? "border-success bg-success/10 text-foreground"
                          : choiceIndex === studentAnswer
                            ? "border-destructive bg-destructive/10 text-foreground"
                            : "border-border text-muted-foreground"
                      )}
                    >
                      {choice}
                    </div>
                  ))}
                </div>
                <p className="pl-6 text-sm text-muted-foreground">
                  {question.explanation}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
