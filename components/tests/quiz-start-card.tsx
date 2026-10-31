"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StartQuizButton } from "@/components/tests/start-quiz-button"
import { createQuiz } from "@/app/(student)/tests/actions"
import { QUESTION_COUNT_OPTIONS, DEFAULT_QUESTION_COUNT } from "@/lib/quiz-content"

const QUESTION_COUNT_ITEMS = Object.fromEntries(
  QUESTION_COUNT_OPTIONS.map((count) => [String(count), `${count} questions`])
)

export function QuizStartCard({
  subjectId,
  subjectName,
}: {
  subjectId: string
  subjectName: string
}) {
  const [questionCount, setQuestionCount] = useState(String(DEFAULT_QUESTION_COUNT))

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <span className="font-medium text-foreground">{subjectName}</span>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Number of questions</Label>
          <Select
            value={questionCount}
            onValueChange={(value) => setQuestionCount(value as string)}
            items={QUESTION_COUNT_ITEMS}
          >
            <SelectTrigger size="sm" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {QUESTION_COUNT_OPTIONS.map((count) => (
                <SelectItem key={count} value={String(count)}>
                  {count} questions
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <form action={createQuiz} className="flex-1">
            <input type="hidden" name="subjectId" value={subjectId} />
            <input type="hidden" name="quizType" value="mcq" />
            <input type="hidden" name="questionCount" value={questionCount} />
            <StartQuizButton label="Multiple choice" />
          </form>
          <form action={createQuiz} className="flex-1">
            <input type="hidden" name="subjectId" value={subjectId} />
            <input type="hidden" name="quizType" value="written" />
            <input type="hidden" name="questionCount" value={questionCount} />
            <StartQuizButton label="Written answer" />
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
