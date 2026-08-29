import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { createClass } from "@/app/(teacher)/actions"
import { EmptyState } from "@/components/empty-state"

export default async function TeacherDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: classes } = await supabase
    .from("teacher_classes")
    .select("id, name, class_code")
    .eq("teacher_id", user!.id)
    .order("created_at", { ascending: false })

  return (
    <div className="flex flex-1 flex-col gap-8 px-6 py-10 sm:px-10">
      <div>
        <span className="text-sm font-medium text-role-teacher">Teacher</span>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Teacher Dashboard
        </h1>
      </div>

      <form
        action={createClass}
        className="flex flex-col gap-2 sm:flex-row sm:items-start"
      >
        <Input name="name" placeholder="Class name, e.g. Grade 10 - Section A" required className="sm:w-72" />
        <Button type="submit">Create class</Button>
      </form>

      {classes && classes.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <Link key={cls.id} href={`/teacher/classes/${cls.id}`}>
              <Card className="transition-colors hover:bg-muted">
                <CardContent className="flex flex-col gap-1">
                  <span className="font-medium text-foreground">{cls.name}</span>
                  <span className="text-sm text-muted-foreground">
                    Code: {cls.class_code}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState message="No classes yet — create one above to get a shareable class code." />
      )}
    </div>
  )
}
