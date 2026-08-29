"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { submitWrittenQuiz } from "@/app/(student)/tests/actions"

interface WrittenQuestion {
  id: string
  prompt: string
}

export function WrittenQuizForm({
  quizId,
  questions,
}: {
  quizId: string
  questions: WrittenQuestion[]
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isPending, startTransition] = useTransition()

  const allAnswered = questions.every((question) => answers[question.id]?.trim())

  return (
    <div className="flex flex-col gap-8">
      {questions.map((question, questionIndex) => (
        <div key={question.id} className="flex flex-col gap-2">
          <Label htmlFor={`answer-${question.id}`} className="font-medium text-foreground">
            {questionIndex + 1}. {question.prompt}
          </Label>
          <Textarea
            id={`answer-${question.id}`}
            value={answers[question.id] ?? ""}
            onChange={(event) =>
              setAnswers((prev) => ({ ...prev, [question.id]: event.target.value }))
            }
            placeholder="Write your answer..."
            className="min-h-24"
          />
        </div>
      ))}
      <Button
        disabled={!allAnswered || isPending}
        onClick={() => startTransition(() => submitWrittenQuiz(quizId, answers))}
      >
        {isPending ? "Grading your answers…" : "Submit quiz"}
      </Button>
    </div>
  )
}
