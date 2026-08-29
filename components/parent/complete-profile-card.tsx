"use client"

import { useActionState, useState } from "react"
import { updateParentProfile } from "@/app/(parent)/actions"
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
import { Card, CardContent } from "@/components/ui/card"
import { PARENT_RELATIONSHIPS, CONTACT_PREFERENCES } from "@/lib/validations/auth"

const RELATIONSHIP_ITEMS = Object.fromEntries(
  PARENT_RELATIONSHIPS.map((option) => [option.value, option.label])
)
const CONTACT_ITEMS = Object.fromEntries(
  CONTACT_PREFERENCES.map((option) => [option.value, option.label])
)

export function CompleteProfileCard() {
  const [state, action, pending] = useActionState(updateParentProfile, undefined)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div>
          <h2 className="font-medium text-foreground">Complete your profile</h2>
          <p className="text-sm text-muted-foreground">
            A few optional details help us keep you in the loop the right way.
          </p>
        </div>
        <form action={action} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-1.5">
            <Label htmlFor="profession">Profession</Label>
            <Input id="profession" name="profession" placeholder="e.g. Software Engineer" required />
            {state?.errors?.profession && (
              <p className="text-sm text-destructive">{state.errors.profession[0]}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Relationship</Label>
            <Select name="relationshipToStudent" items={RELATIONSHIP_ITEMS}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Choose" />
              </SelectTrigger>
              <SelectContent>
                {PARENT_RELATIONSHIPS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state?.errors?.relationshipToStudent && (
              <p className="text-sm text-destructive">
                {state.errors.relationshipToStudent[0]}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Preferred contact</Label>
            <Select name="contactPreference" items={CONTACT_ITEMS}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Choose" />
              </SelectTrigger>
              <SelectContent>
                {CONTACT_PREFERENCES.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state?.errors?.contactPreference && (
              <p className="text-sm text-destructive">
                {state.errors.contactPreference[0]}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDismissed(true)}
            >
              Maybe later
            </Button>
          </div>
        </form>
        {state?.message && (
          <p className="text-sm text-destructive">{state.message}</p>
        )}
      </CardContent>
    </Card>
  )
}
