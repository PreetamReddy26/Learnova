"use client"

import { useActionState, useState } from "react"
import { completeOnboarding } from "@/app/(auth)/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LEARNING_STYLES } from "@/lib/validations/auth"

const GRADES = Array.from({ length: 12 }, (_, i) => i + 1)
const GRADE_ITEMS = Object.fromEntries(
  GRADES.map((grade) => [String(grade), `Grade ${grade}`])
)
const LEARNING_STYLE_ITEMS = Object.fromEntries(
  LEARNING_STYLES.map((style) => [style.value, style.label])
)

interface OnboardingWizardProps {
  role: "student" | "teacher"
  curricula: { id: string; name: string }[]
}

export function OnboardingWizard({ role, curricula }: OnboardingWizardProps) {
  const [state, action, pending] = useActionState(completeOnboarding, undefined)
  const [step, setStep] = useState(1)
  const totalSteps = role === "student" ? 2 : 1
  const curriculumItems = Object.fromEntries(
    curricula.map((curriculum) => [curriculum.id, curriculum.name])
  )

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-4" hidden={step !== 1}>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="schoolName">School name</Label>
          <Input id="schoolName" name="schoolName" required={step === 1} />
          {state?.errors?.schoolName && (
            <p className="text-sm text-destructive">
              {state.errors.schoolName[0]}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" required={step === 1} />
          {state?.errors?.city && (
            <p className="text-sm text-destructive">{state.errors.city[0]}</p>
          )}
        </div>
        {role === "student" && (
          <>
            <div className="flex flex-col gap-1.5">
              <Label>Curriculum</Label>
              <Select name="curriculumId" items={curriculumItems}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose your curriculum" />
                </SelectTrigger>
                <SelectContent>
                  {curricula.map((curriculum) => (
                    <SelectItem key={curriculum.id} value={curriculum.id}>
                      {curriculum.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state?.errors?.curriculumId && (
                <p className="text-sm text-destructive">
                  {state.errors.curriculumId[0]}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Grade</Label>
              <Select name="grade" items={GRADE_ITEMS}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose your grade" />
                </SelectTrigger>
                <SelectContent>
                  {GRADES.map((grade) => (
                    <SelectItem key={grade} value={String(grade)}>
                      Grade {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state?.errors?.grade && (
                <p className="text-sm text-destructive">
                  {state.errors.grade[0]}
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {role === "student" && (
        <div className="flex flex-col gap-1.5" hidden={step !== 2}>
          <Label>Preferred learning style</Label>
          <Select name="learningStyle" items={LEARNING_STYLE_ITEMS}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose how you learn best" />
            </SelectTrigger>
            <SelectContent>
              {LEARNING_STYLES.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state?.errors?.learningStyle && (
            <p className="text-sm text-destructive">
              {state.errors.learningStyle[0]}
            </p>
          )}
        </div>
      )}

      {state?.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <div className="flex gap-2">
        {step > 1 && (
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={(event) => {
              event.preventDefault()
              setStep(step - 1)
            }}
          >
            Back
          </Button>
        )}
        {step < totalSteps ? (
          <Button
            type="button"
            className="flex-1"
            onClick={(event) => {
              event.preventDefault()
              setStep(step + 1)
            }}
          >
            Continue
          </Button>
        ) : (
          <Button type="submit" disabled={pending} className="flex-1">
            {pending ? "Saving…" : "Finish setup"}
          </Button>
        )}
      </div>
    </form>
  )
}
