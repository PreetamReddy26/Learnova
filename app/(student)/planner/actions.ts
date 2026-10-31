"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { XP_REWARDS } from "@/lib/gamification"

async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return { supabase, user }
}

export async function createPlanItem(formData: FormData) {
  const { supabase, user } = await requireUser()

  const title = formData.get("title") as string
  const scheduledDate = formData.get("scheduledDate") as string
  const subjectId = formData.get("subjectId") as string | null
  const durationMinutes = formData.get("durationMinutes") as string | null

  const { error } = await supabase.from("study_plan_items").insert({
    student_id: user.id,
    title,
    scheduled_date: scheduledDate,
    subject_id: subjectId || null,
    duration_minutes: durationMinutes ? Number(durationMinutes) : null,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/planner")
}

export async function togglePlanItem(id: string, completed: boolean) {
  const { supabase, user } = await requireUser()

  const { error } = await supabase
    .from("study_plan_items")
    .update({
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    })
    .eq("id", id)
    .eq("student_id", user.id)

  if (error) {
    throw new Error(error.message)
  }

  if (completed) {
    await supabase.from("xp_events").insert({
      student_id: user.id,
      amount: XP_REWARDS.planItemCompleted,
      reason: "Completed a study task",
    })
  }

  revalidatePath("/planner")
  revalidatePath("/dashboard")
}

export async function generateSmartPlan() {
  const { supabase, user } = await requireUser()

  const { data: attempts } = await supabase
    .from("quiz_attempts")
    .select("score, total, quizzes(subject_id, subjects(id, name))")
    .eq("student_id", user.id)

  const bySubject = new Map<string, { id: string; name: string; total: number; count: number }>()
  for (const attempt of attempts ?? []) {
    const subject = attempt.quizzes?.subjects
    if (!subject) continue
    const percent = (attempt.score / attempt.total) * 100
    const existing = bySubject.get(subject.id) ?? {
      id: subject.id,
      name: subject.name,
      total: 0,
      count: 0,
    }
    bySubject.set(subject.id, {
      ...existing,
      total: existing.total + percent,
      count: existing.count + 1,
    })
  }

  let weakestSubject: { id: string; name: string } | null = null
  let lowestAverage = Infinity
  for (const subject of bySubject.values()) {
    const average = subject.total / subject.count
    if (average < lowestAverage) {
      lowestAverage = average
      weakestSubject = subject
    }
  }

  if (!weakestSubject) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("curriculum_id, grade")
      .eq("id", user.id)
      .single()

    let fallbackQuery = supabase
      .from("subjects")
      .select("id, name")
      .eq("curriculum_id", profile?.curriculum_id ?? "")
    if (profile?.grade) {
      fallbackQuery = fallbackQuery
        .lte("grade_min", profile.grade)
        .gte("grade_max", profile.grade)
    }
    const { data: fallbackSubject } = await fallbackQuery
      .order("name")
      .limit(1)
      .maybeSingle()

    weakestSubject = fallbackSubject
  }

  if (!weakestSubject) {
    return
  }

  const today = new Date()
  const items = [0, 1, 2].map((offset) => {
    const date = new Date(today)
    date.setDate(date.getDate() + offset)
    return {
      student_id: user.id,
      subject_id: weakestSubject!.id,
      title: `Review ${weakestSubject!.name}`,
      scheduled_date: date.toISOString().slice(0, 10),
      duration_minutes: 30,
    }
  })

  const { error } = await supabase.from("study_plan_items").insert(items)
  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/planner")
}

export async function createGoal(formData: FormData) {
  const { supabase, user } = await requireUser()

  const title = formData.get("title") as string
  const type = formData.get("type") as string
  const targetCount = Number(formData.get("targetCount"))
  const dueDate = formData.get("dueDate") as string | null

  const { error } = await supabase.from("goals").insert({
    student_id: user.id,
    title,
    type: type as "weekly" | "monthly" | "subject" | "revision",
    target_count: targetCount,
    due_date: dueDate || null,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/planner")
}

export async function incrementGoal(id: string) {
  const { supabase, user } = await requireUser()

  const { data: goal } = await supabase
    .from("goals")
    .select("current_count, target_count")
    .eq("id", id)
    .eq("student_id", user.id)
    .single()

  if (!goal) return

  const { error } = await supabase
    .from("goals")
    .update({
      current_count: Math.min(goal.current_count + 1, goal.target_count),
    })
    .eq("id", id)
    .eq("student_id", user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/planner")
}
