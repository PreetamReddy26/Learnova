import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { LogoutButton } from "@/components/auth/logout-button"
import { SidebarNav } from "@/components/student/sidebar-nav"
import { createClient } from "@/lib/supabase/server"
import { ROLE_HOME } from "@/lib/roles"

const BASE_NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/assistant", label: "AI Assistant" },
  { href: "/planner", label: "Study Planner" },
  { href: "/tests", label: "Tests" },
  { href: "/reports", label: "Reports" },
  { href: "/profile", label: "Profile" },
]

export default async function StudentLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase.from("profiles").select("role, grade").eq("id", user.id).single()
    : { data: null }

  if (profile && profile.role !== "student") {
    redirect(ROLE_HOME[profile.role])
  }

  const navItems =
    (profile?.grade ?? 0) >= 11
      ? [
          ...BASE_NAV_ITEMS.slice(0, 5),
          { href: "/career-compass", label: "Career Compass" },
          ...BASE_NAV_ITEMS.slice(5),
        ]
      : BASE_NAV_ITEMS

  return (
    <div className="flex flex-1 flex-col sm:flex-row">
      <aside className="flex shrink-0 flex-col gap-1 border-b border-border px-4 py-4 sm:w-56 sm:border-b-0 sm:border-r sm:px-3 sm:py-6">
        <span className="mb-3 px-2 text-sm font-semibold text-role-student">
          Learnova
        </span>
        <SidebarNav items={navItems} />
        <LogoutButton className="mt-2 px-2 py-1.5 text-left" />
      </aside>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  )
}
