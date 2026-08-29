"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { linkChild } from "@/app/(parent)/actions"

export function LinkChildForm() {
  const [state, action, pending] = useActionState(linkChild, undefined)

  return (
    <form action={action} className="flex flex-col gap-2 sm:flex-row sm:items-start">
      <Input
        name="inviteCode"
        placeholder="Enter your child's invite code"
        className="sm:w-64"
        required
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Linking…" : "Link child"}
      </Button>
      {state?.message && (
        <p className="text-sm text-destructive sm:self-center">{state.message}</p>
      )}
    </form>
  )
}
