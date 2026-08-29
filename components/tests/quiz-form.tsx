"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { submitMCQQuiz } from "@/app/(student)/tests/actions"
import { cn } from "@/lib/utils"

interface Question {
  id: string
  prompt: string
  choices: string[]
}

export function QuizForm({
  quizId,
  questions,
}: {
  quizId: string
  questions: Question[]
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [isPending, startTransition] = useTransition()

  const allAnswered = questions.every((question) => answers[question.id] !== undefined)

  return (
    <div className="flex flex-col gap-8">
      {questions.map((question, questionIndex) => (
        <div key={question.id} className="flex flex-col gap-3">
          <p className="font-medium text-foreground">
            {questionIndex + 1}. {question.prompt}
          </p>
          <div className="flex flex-col gap-2">
            {question.choices.map((choice, choiceIndex) => (
              <label
                key={choiceIndex}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-lg border border-input px-3 py-2 text-sm text-foreground",
                  answers[question.id] === choiceIndex &&
                    "border-primary bg-accent"
                )}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  className="sr-only"
                  checked={answers[question.id] === choiceIndex}
                  onChange={() =>
                    setAnswers((prev) => ({ ...prev, [question.id]: choiceIndex }))
                  }
                />
                {choice}
              </label>
            ))}
          </div>
        </div>
      ))}
      <Button
        disabled={!allAnswered || isPending}
        onClick={() => startTransition(() => submitMCQQuiz(quizId, answers))}
      >
        {isPending ? "Submitting…" : "Submit quiz"}
      </Button>
    </div>
  )
}
