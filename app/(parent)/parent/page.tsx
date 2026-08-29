import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { LinkChildForm } from "@/components/parent/link-child-form"
import { CompleteProfileCard } from "@/components/parent/complete-profile-card"
import { EmptyState } from "@/components/empty-state"

export default async function ParentDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: profile }, { data: links }] = await Promise.all([
    supabase.from("profiles").select("profession").eq("id", user!.id).single(),
    supabase
      .from("parent_child_links")
      .select(
        "student_id, profiles!parent_child_links_student_id_fkey(full_name, grade, curricula(name))"
      )
      .eq("parent_id", user!.id),
  ])

  return (
    <div className="flex flex-1 flex-col gap-8 px-6 py-10 sm:px-10">
      <div>
        <span className="text-sm font-medium text-role-parent">Parent</span>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Parent Dashboard
        </h1>
      </div>

      {!profile?.profession && <CompleteProfileCard />}

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Link a child
        </h2>
        <LinkChildForm />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-muted-foreground">
          Your children
        </h2>
        {links && links.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {links.map((link) => (
              <Link key={link.student_id} href={`/parent/reports/${link.student_id}`}>
                <Card className="transition-colors hover:bg-muted">
                  <CardContent className="flex flex-col gap-1">
                    <span className="font-medium text-foreground">
                      {link.profiles?.full_name ?? "Student"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {link.profiles?.curricula?.name ?? "Curriculum not set"}
                      {link.profiles?.grade ? ` · Grade ${link.profiles.grade}` : ""}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState message="No children linked yet. Ask your child for their invite code from their Profile page." />
        )}
      </div>
    </div>
  )
}
