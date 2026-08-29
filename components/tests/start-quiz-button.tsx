"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"

export function StartQuizButton({ label }: { label: string }) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      size="sm"
      variant="outline"
      className="w-full"
      disabled={pending}
    >
      {pending ? "Generating quiz…" : label}
    </Button>
  )
}
