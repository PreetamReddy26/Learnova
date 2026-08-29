"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import {
  generateMCQQuiz,
  generateWrittenQuiz,
  gradeWrittenAnswer,
} from "@/lib/quiz-content"
import { XP_REWARDS } from "@/lib/gamification"
import type { Enums } from "@/lib/supabase/types"

export async function createQuiz(formData: FormData) {
  const subjectId = formData.get("subjectId") as string
  const quizType = formData.get("quizType") as Enums<"quiz_type">
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const [{ data: subject }, { data: profile }] = await Promise.all([
    supabase.from("subjects").select("name").eq("id", subjectId).single(),
    supabase
      .from("profiles")
      .select("grade, curricula(name)")
      .eq("id", user.id)
      .single(),
  ])

  const subjectName = subject?.name ?? "General"
  const curriculum = profile?.curricula?.name ?? "your curriculum"
  const grade = profile?.grade ?? null

  const { data: quiz, error } = await supabase
    .from("quizzes")
    .insert({
      student_id: user.id,
      subject_id: subjectId,
      quiz_type: quizType,
      title:
        quizType === "written"
          ? `${subjectName} written practice`
          : `${subjectName} practice quiz`,
    })
    .select("id")
    .single()

  if (error || !quiz) {
    throw new Error(error?.message ?? "Failed to create quiz.")
  }

  if (quizType === "written") {
    const questions = await generateWrittenQuiz({ subjectName, curriculum, grade })
    const { error: questionsError } = await supabase.from("quiz_questions").insert(
      questions.map((question, index) => ({
        quiz_id: quiz.id,
        position: index,
        prompt: question.prompt,
        model_answer: question.modelAnswer,
      }))
    )
    if (questionsError) throw new Error(questionsError.message)
  } else {
    const questions = await generateMCQQuiz({ subjectName, curriculum, grade })
    const { error: questionsError } = await supabase.from("quiz_questions").insert(
      questions.map((question, index) => ({
        quiz_id: quiz.id,
        position: index,
        prompt: question.prompt,
        choices: question.choices,
        correct_index: question.correctIndex,
        explanation: question.explanation,
      }))
    )
    if (questionsError) throw new Error(questionsError.message)
  }

  redirect(`/tests/${quiz.id}`)
}

export async function submitMCQQuiz(
  quizId: string,
  answers: Record<string, number>
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("id, correct_index")
    .eq("quiz_id", quizId)

  const total = questions?.length ?? 0
  const score =
    questions?.filter((question) => answers[question.id] === question.correct_index)
      .length ?? 0

  const { error } = await supabase.from("quiz_attempts").insert({
    quiz_id: quizId,
    student_id: user.id,
    score,
    total,
    answers,
  })

  if (error) {
    throw new Error(error.message)
  }

  await supabase.from("xp_events").insert({
    student_id: user.id,
    amount: XP_REWARDS.quizCompleted,
    reason: "Completed a practice quiz",
  })

  redirect(`/tests/${quizId}/results`)
}

export async function submitWrittenQuiz(
  quizId: string,
  answers: Record<string, string>
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("id, prompt, model_answer")
    .eq("quiz_id", quizId)
    .order("position")

  const total = questions?.length ?? 0

  const graded = await Promise.all(
    (questions ?? []).map(async (question) => {
      const result = await gradeWrittenAnswer({
        question: question.prompt,
        modelAnswer: question.model_answer ?? "",
        studentAnswer: answers[question.id] ?? "",
      })
      return { questionId: question.id, ...result, text: answers[question.id] ?? "" }
    })
  )

  const score = graded.reduce((sum, g) => sum + g.score, 0)
  const gradedAnswers = Object.fromEntries(
    graded.map((g) => [g.questionId, { text: g.text, score: g.score, feedback: g.feedback }])
  )

  const { error } = await supabase.from("quiz_attempts").insert({
    quiz_id: quizId,
    student_id: user.id,
    score,
    total,
    answers: gradedAnswers,
  })

  if (error) {
    throw new Error(error.message)
  }

  await supabase.from("xp_events").insert({
    student_id: user.id,
    amount: XP_REWARDS.quizCompleted,
    reason: "Completed a practice quiz",
  })

  redirect(`/tests/${quizId}/results`)
}
