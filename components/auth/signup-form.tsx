"use client"

import { useActionState, useState } from "react"
import Link from "next/link"
import { signup } from "@/app/(auth)/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const ROLES = [
  { value: "student", label: "Student" },
  { value: "parent", label: "Parent" },
  { value: "teacher", label: "Teacher" },
] as const

export function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined)
  // Controlled so a validation error (e.g. weak password) doesn't wipe the
  // rest of the form — React resets uncontrolled fields after any <form
  // action={serverAction}> submission finishes, success or not.
  const [role, setRole] = useState<(typeof ROLES)[number]["value"]>("student")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>I am a...</Label>
        <div className="grid grid-cols-3 gap-2">
          {ROLES.map((roleOption) => (
            <label key={roleOption.value} className="cursor-pointer">
              <input
                type="radio"
                name="role"
                value={roleOption.value}
                checked={role === roleOption.value}
                onChange={() => setRole(roleOption.value)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "flex items-center justify-center rounded-lg border border-input px-2 py-1.5 text-sm text-muted-foreground transition-colors",
                  "peer-checked:border-primary peer-checked:bg-accent peer-checked:text-accent-foreground",
                  "peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50"
                )}
              >
                {roleOption.label}
              </span>
            </label>
          ))}
        </div>
        {state?.errors?.role && (
          <p className="text-sm text-destructive">{state.errors.role[0]}</p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          name="fullName"
          autoComplete="name"
          required
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
        />
        {state?.errors?.fullName && (
          <p className="text-sm text-destructive">{state.errors.fullName[0]}</p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        {state?.errors?.email && (
          <p className="text-sm text-destructive">{state.errors.email[0]}</p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone">Phone number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
        {state?.errors?.phone && (
          <p className="text-sm text-destructive">{state.errors.phone[0]}</p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          required
        />
        {state?.errors?.password && (
          <p className="text-sm text-destructive">{state.errors.password[0]}</p>
        )}
      </div>
      {state?.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Creating account…" : "Create account"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-brand hover:underline">
          Log in
        </Link>
      </p>
    </form>
  )
}
