"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { Enums } from "@/lib/supabase/types"

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const fullName = formData.get("fullName") as string
  const phone = formData.get("phone") as string
  const schoolName = formData.get("schoolName") as string
  const city = formData.get("city") as string
  const curriculumId = formData.get("curriculumId") as string
  const grade = formData.get("grade") as string
  const learningStyle = formData.get("learningStyle") as string

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone,
      school_name: schoolName,
      city,
      curriculum_id: curriculumId || null,
      grade: grade ? Number(grade) : null,
      learning_style: (learningStyle || null) as Enums<"learning_style"> | null,
    })
    .eq("id", user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/profile")
  revalidatePath("/dashboard")
}
