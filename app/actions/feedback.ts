"use server"

import { createClient } from "@/lib/supabase/server"

export type FeedbackState = { message?: string; success?: boolean } | undefined

export async function submitFeedback(
  _prevState: FeedbackState,
  formData: FormData
): Promise<FeedbackState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { message: "You need to be logged in to send feedback." }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  const message = (formData.get("message") as string)?.trim()
  const ratingRaw = formData.get("rating") as string | null
  const pagePath = formData.get("pagePath") as string | null

  if (!message) {
    return { message: "Please write a message before sending." }
  }

  const rating = ratingRaw ? Number(ratingRaw) : null

  const { error } = await supabase.from("feedback").insert({
    user_id: user.id,
    role: profile?.role ?? "student",
    message,
    rating: rating && rating >= 1 && rating <= 5 ? rating : null,
    page_path: pagePath || null,
  })

  if (error) {
    return { message: "Something went wrong sending your feedback. Please try again." }
  }

  return { success: true }
}
