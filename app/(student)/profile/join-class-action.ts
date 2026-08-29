"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export type JoinClassState = { message?: string; className?: string } | undefined

export async function joinClass(
  _prevState: JoinClassState,
  formData: FormData
): Promise<JoinClassState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const code = (formData.get("classCode") as string)?.trim().toUpperCase()

  if (!code) {
    return { message: "Enter a class code." }
  }

  const { data, error } = await supabase.rpc("join_class_by_code", { code })

  if (error || !data?.[0]) {
    return { message: "That class code doesn't match any class." }
  }

  revalidatePath("/profile")
  return { className: data[0].joined_class_name }
}
