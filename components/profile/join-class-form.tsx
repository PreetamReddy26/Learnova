"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { joinClass } from "@/app/(student)/profile/join-class-action"

export function JoinClassForm() {
  const [state, action, pending] = useActionState(joinClass, undefined)

  return (
    <form action={action} className="flex flex-col gap-2 sm:flex-row sm:items-start">
      <Input
        name="classCode"
        placeholder="Enter your teacher's class code"
        className="sm:w-64"
        required
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Joining…" : "Join class"}
      </Button>
      {state?.message && (
        <p className="text-sm text-destructive sm:self-center">{state.message}</p>
      )}
      {state?.className && (
        <p className="text-sm text-success sm:self-center">
          Joined {state.className}
        </p>
      )}
    </form>
  )
}
