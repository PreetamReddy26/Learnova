"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function createConversation() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data, error } = await supabase
    .from("conversations")
    .insert({ student_id: user.id })
    .select("id")
    .single()

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to start a new conversation.")
  }

  redirect(`/assistant/${data.id}`)
}
