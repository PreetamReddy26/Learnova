import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PlanItemRow } from "@/components/planner/plan-item-row"
import { GoalRow } from "@/components/planner/goal-row"
import { EmptyState } from "@/components/empty-state"
import {
  createGoal,
  createPlanItem,
  generateSmartPlan,
} from "@/app/(student)/planner/actions"

const GOAL_TYPES = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "subject", label: "Subject" },
  { value: "revision", label: "Revision" },
]
const GOAL_TYPE_ITEMS = Object.fromEntries(
  GOAL_TYPES.map((type) => [type.value, type.label])
)

export default async function PlannerPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: profile }, { data: planItems }, { data: goals }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("curriculum_id")
        .eq("id", user!.id)
        .single(),
      supabase
        .from("study_plan_items")
        .select("id, title, scheduled_date, duration_minutes, completed")
        .eq("student_id", user!.id)
        .order("scheduled_date"),
      supabase
        .from("goals")
        .select("id, title, current_count, target_count")
        .eq("student_id", user!.id)
        .order("created_at", { ascending: false }),
    ])

  const { data: subjects } = profile?.curriculum_id
    ? await supabase
        .from("subjects")
        .select("id, name")
        .eq("curriculum_id", profile.curriculum_id)
        .order("name")
    : { data: [] }

  const subjectItems = Object.fromEntries(
    (subjects ?? []).map((subject) => [subject.id, subject.name])
  )

  const itemsByDate = new Map<string, typeof planItems>()
  for (const item of planItems ?? []) {
    const existing = itemsByDate.get(item.scheduled_date) ?? []
    itemsByDate.set(item.scheduled_date, [...existing, item])
  }

  return (
    <div className="flex flex-1 flex-col gap-10 px-6 py-10 sm:px-10">
      <div>
        <span className="text-sm font-medium text-brand">Student</span>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Study Planner
        </h1>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">Agenda</h2>
          <form action={generateSmartPlan}>
            <Button type="submit" size="sm" variant="outline">
              Suggest a study plan
            </Button>
          </form>
        </div>

        <form
          action={createPlanItem}
          className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-end"
        >
          <div className="flex flex-1 flex-col gap-1.5">
            <Label htmlFor="title">Task</Label>
            <Input id="title" name="title" placeholder="Revise Chapter 4" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Subject</Label>
            <Select name="subjectId" items={subjectItems}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Optional" />
              </SelectTrigger>
              <SelectContent>
                {(subjects ?? []).map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="scheduledDate">Date</Label>
            <Input
              id="scheduledDate"
              name="scheduledDate"
              type="date"
              required
              defaultValue={new Date().toISOString().slice(0, 10)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="durationMinutes">Minutes</Label>
            <Input
              id="durationMinutes"
              name="durationMinutes"
              type="number"
              min={5}
              placeholder="30"
              className="w-24"
            />
          </div>
          <Button type="submit">Add</Button>
        </form>

        {itemsByDate.size > 0 ? (
          <div className="flex flex-col gap-6">
            {Array.from(itemsByDate.entries()).map(([date, items]) => (
              <div key={date} className="flex flex-col gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {new Date(date).toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                {items!.map((item) => (
                  <PlanItemRow
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    completed={item.completed}
                    durationMinutes={item.duration_minutes}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No study tasks yet — add one above or generate a suggested plan." />
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-muted-foreground">Goals</h2>

        <form
          action={createGoal}
          className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-end"
        >
          <div className="flex flex-1 flex-col gap-1.5">
            <Label htmlFor="goalTitle">Goal</Label>
            <Input
              id="goalTitle"
              name="title"
              placeholder="Finish 5 practice quizzes"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Type</Label>
            <Select name="type" items={GOAL_TYPE_ITEMS} defaultValue="weekly">
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GOAL_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="targetCount">Target</Label>
            <Input
              id="targetCount"
              name="targetCount"
              type="number"
              min={1}
              defaultValue={5}
              className="w-20"
              required
            />
          </div>
          <Button type="submit">Add goal</Button>
        </form>

        {goals && goals.length > 0 ? (
          <div className="flex flex-col gap-3">
            {goals.map((goal) => (
              <GoalRow
                key={goal.id}
                id={goal.id}
                title={goal.title}
                currentCount={goal.current_count}
                targetCount={goal.target_count}
              />
            ))}
          </div>
        ) : (
          <EmptyState message="No goals set yet — add one above to start tracking progress." />
        )}
      </div>
    </div>
  )
}
