"use client"

import { useTransition } from "react"
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
import { updateProfile } from "@/app/(student)/profile/actions"
import { LEARNING_STYLES } from "@/lib/validations/auth"

const GRADES = Array.from({ length: 12 }, (_, i) => i + 1)
const GRADE_ITEMS = Object.fromEntries(
  GRADES.map((grade) => [String(grade), `Grade ${grade}`])
)
const LEARNING_STYLE_ITEMS = Object.fromEntries(
  LEARNING_STYLES.map((style) => [style.value, style.label])
)

interface ProfileFormProps {
  fullName: string
  phone: string | null
  schoolName: string | null
  city: string | null
  curriculumId: string | null
  grade: number | null
  learningStyle: string | null
  curricula: { id: string; name: string }[]
}

export function ProfileForm({
  fullName,
  phone,
  schoolName,
  city,
  curriculumId,
  grade,
  learningStyle,
  curricula,
}: ProfileFormProps) {
  const [isPending, startTransition] = useTransition()
  const curriculumItems = Object.fromEntries(
    curricula.map((curriculum) => [curriculum.id, curriculum.name])
  )

  return (
    <form
      action={(formData) => startTransition(() => updateProfile(formData))}
      className="flex flex-col gap-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" name="fullName" defaultValue={fullName} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Phone number</Label>
          <Input id="phone" name="phone" defaultValue={phone ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="schoolName">School name</Label>
          <Input id="schoolName" name="schoolName" defaultValue={schoolName ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" defaultValue={city ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Curriculum</Label>
          <Select
            name="curriculumId"
            items={curriculumItems}
            defaultValue={curriculumId ?? undefined}
          >
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
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Grade</Label>
          <Select
            name="grade"
            items={GRADE_ITEMS}
            defaultValue={grade ? String(grade) : undefined}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose your grade" />
            </SelectTrigger>
            <SelectContent>
              {GRADES.map((g) => (
                <SelectItem key={g} value={String(g)}>
                  Grade {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label>Preferred learning style</Label>
          <Select
            name="learningStyle"
            items={LEARNING_STYLE_ITEMS}
            defaultValue={learningStyle ?? undefined}
          >
            <SelectTrigger className="w-full sm:w-64">
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
        </div>
      </div>
      <Button type="submit" disabled={isPending} className="self-start">
        {isPending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  )
}
