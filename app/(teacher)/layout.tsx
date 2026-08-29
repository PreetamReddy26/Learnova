import type { ReactNode } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { LogoutButton } from "@/components/auth/logout-button"
import { createClient } from "@/lib/supabase/server"
import { ROLE_HOME } from "@/lib/roles"

export default async function TeacherLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase.from("profiles").select("role").eq("id", user.id).single()
    : { data: null }

  if (profile && profile.role !== "teacher") {
    redirect(ROLE_HOME[profile.role])
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-border px-6 py-4 sm:px-10">
        <Link
          href="/teacher"
          className="text-sm font-semibold text-role-teacher"
        >
          Learnova · Teacher
        </Link>
        <LogoutButton />
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  )
}
