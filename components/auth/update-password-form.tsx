"use client"

import { useActionState, useEffect, useState } from "react"
import Link from "next/link"
import { updatePassword } from "@/app/(auth)/actions"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function UpdatePasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, undefined)
  const [sessionStatus, setSessionStatus] = useState<
    "checking" | "valid" | "invalid"
  >("checking")

  useEffect(() => {
    const supabase = createClient()

    // Supabase's default reset-password email links here with the session
    // tokens in the URL fragment — the server never sees them, so the
    // browser client has to parse the URL and establish the session itself.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionStatus(session ? "valid" : "invalid")
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY" || session) {
          setSessionStatus("valid")
        }
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  if (sessionStatus === "checking") {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Checking your reset link…
      </p>
    )
  }

  if (sessionStatus === "invalid") {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-destructive">
          This link is invalid or has expired.
        </p>
        <Link
          href="/forgot-password"
          className="text-sm text-brand hover:underline"
        >
          Request a new link
        </Link>
      </div>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">New password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
        {state?.errors?.password && (
          <p className="text-sm text-destructive">{state.errors.password[0]}</p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
        />
        {state?.errors?.confirmPassword && (
          <p className="text-sm text-destructive">
            {state.errors.confirmPassword[0]}
          </p>
        )}
      </div>
      {state?.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Updating…" : "Update password"}
      </Button>
    </form>
  )
}
