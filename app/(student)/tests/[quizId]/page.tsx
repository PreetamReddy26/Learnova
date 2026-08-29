import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { QuizForm } from "@/components/tests/quiz-form"
import { WrittenQuizForm } from "@/components/tests/written-quiz-form"

export default async function QuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>
}) {
  const { quizId } = await params
  const supabase = await createClient()

  const [{ data: quiz }, { data: questions }] = await Promise.all([
    supabase.from("quizzes").select("title, quiz_type").eq("id", quizId).single(),
    supabase
      .from("quiz_questions")
      .select("id, prompt, choices")
      .eq("quiz_id", quizId)
      .order("position"),
  ])

  if (!quiz || !questions) {
    notFound()
  }

  return (
    <div className="flex flex-1 flex-col gap-8 px-6 py-10 sm:px-10">
      <div>
        <span className="text-sm font-medium text-brand">Student</span>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {quiz.title}
        </h1>
      </div>
      {quiz.quiz_type === "written" ? (
        <WrittenQuizForm
          quizId={quizId}
          questions={questions.map((question) => ({
            id: question.id,
            prompt: question.prompt,
          }))}
        />
      ) : (
        <QuizForm
          quizId={quizId}
          questions={questions.map((question) => ({
            id: question.id,
            prompt: question.prompt,
            choices: question.choices as string[],
          }))}
        />
      )}
    </div>
  )
}
