"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

function generateClassCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

export async function createClass(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const name = formData.get("name") as string

  const { data, error } = await supabase
    .from("teacher_classes")
    .insert({ teacher_id: user.id, name, class_code: generateClassCode() })
    .select("id")
    .single()

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to create class.")
  }

  redirect(`/teacher/classes/${data.id}`)
}

export async function createAssignment(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const classId = formData.get("classId") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const subjectId = formData.get("subjectId") as string | null
  const dueDate = formData.get("dueDate") as string | null

  const { error } = await supabase.from("assignments").insert({
    class_id: classId,
    teacher_id: user.id,
    title,
    description: description || null,
    subject_id: subjectId || null,
    due_date: dueDate || null,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/teacher/classes/${classId}`)
}
