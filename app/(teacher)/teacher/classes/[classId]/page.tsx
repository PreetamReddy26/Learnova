import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createAssignment } from "@/app/(teacher)/actions"
import { EmptyState } from "@/components/empty-state"

export default async function TeacherClassPage({
  params,
}: {
  params: Promise<{ classId: string }>
}) {
  const { classId } = await params
  const supabase = await createClient()

  const [{ data: cls }, { data: roster }, { data: assignments }] =
    await Promise.all([
      supabase
        .from("teacher_classes")
        .select("name, class_code")
        .eq("id", classId)
        .single(),
      supabase
        .from("class_students")
        .select("student_id, profiles(full_name, grade)")
        .eq("class_id", classId),
      supabase
        .from("assignments")
        .select("id, title, description, due_date")
        .eq("class_id", classId)
        .order("created_at", { ascending: false }),
    ])

  if (!cls) {
    notFound()
  }

  const studentIds = (roster ?? []).map((r) => r.student_id)
  const { data: attempts } = studentIds.length
    ? await supabase
        .from("quiz_attempts")
        .select("student_id, score, total")
        .in("student_id", studentIds)
    : { data: [] }

  const statsByStudent = new Map<string, { count: number; total: number }>()
  for (const attempt of attempts ?? []) {
    const existing = statsByStudent.get(attempt.student_id) ?? { count: 0, total: 0 }
    statsByStudent.set(attempt.student_id, {
      count: existing.count + 1,
      total: existing.total + (attempt.score / attempt.total) * 100,
    })
  }

  return (
    <div className="flex flex-1 flex-col gap-8 px-6 py-10 sm:px-10">
      <div>
        <span className="text-sm font-medium text-role-teacher">Teacher</span>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {cls.name}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Share code <span className="font-mono font-medium">{cls.class_code}</span>{" "}
          with students to join this class.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Class roster
        </h2>
        {roster && roster.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Student</th>
                  <th className="px-4 py-2 font-medium">Grade</th>
                  <th className="px-4 py-2 font-medium">Quizzes taken</th>
                  <th className="px-4 py-2 font-medium">Average score</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((entry) => {
                  const stats = statsByStudent.get(entry.student_id)
                  const average = stats ? Math.round(stats.total / stats.count) : null
                  return (
                    <tr key={entry.student_id} className="border-b border-border last:border-0">
                      <td className="px-4 py-2 text-foreground">
                        {entry.profiles?.full_name ?? "Student"}
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {entry.profiles?.grade ?? "—"}
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {stats?.count ?? 0}
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {average !== null ? `${average}%` : "—"}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="No students have joined yet — share the class code above." />
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-muted-foreground">
          Assignments
        </h2>
        <form
          action={createAssignment}
          className="flex flex-col gap-3 rounded-lg border border-border p-4"
        >
          <input type="hidden" name="classId" value={classId} />
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="Chapter 5 revision" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Study material or instructions for students"
            />
          </div>
          <div className="flex flex-col gap-1.5 sm:w-48">
            <Label htmlFor="dueDate">Due date</Label>
            <Input id="dueDate" name="dueDate" type="date" />
          </div>
          <Button type="submit" className="self-start">
            Create assignment
          </Button>
        </form>

        {assignments && assignments.length > 0 && (
          <ul className="flex flex-col gap-2">
            {assignments.map((assignment) => (
              <li
                key={assignment.id}
                className="flex flex-col gap-1 rounded-lg border border-border px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {assignment.title}
                  </span>
                  {assignment.due_date && (
                    <span className="text-xs text-muted-foreground">
                      Due {new Date(assignment.due_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {assignment.description && (
                  <p className="text-sm text-muted-foreground">
                    {assignment.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
