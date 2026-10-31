import type { ReactNode } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { LogoutButton } from "@/components/auth/logout-button"
import { ROLE_HOME } from "@/lib/roles"

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_admin")
    .eq("id", user.id)
    .single()

  if (!profile?.is_admin) {
    redirect(ROLE_HOME[profile?.role ?? "student"])
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-border px-6 py-4 sm:px-10">
        <div className="flex items-center gap-6">
          <Link href="/admin/feedback" className="text-sm font-semibold">
            Learnova · Admin
          </Link>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/admin/feedback" className="hover:text-foreground">
              Feedback
            </Link>
            <Link href="/admin/review-queue" className="hover:text-foreground">
              Review Queue
            </Link>
          </nav>
        </div>
        <LogoutButton />
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  )
}
