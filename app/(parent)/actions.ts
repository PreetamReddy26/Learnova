"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ParentProfileSchema, type ParentProfileState } from "@/lib/validations/auth"
import type { Enums } from "@/lib/supabase/types"

export type LinkChildState = { message?: string } | undefined

export async function linkChild(
  _prevState: LinkChildState,
  formData: FormData
): Promise<LinkChildState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const code = (formData.get("inviteCode") as string)?.trim().toUpperCase()

  if (!code) {
    return { message: "Enter an invite code." }
  }

  const { error } = await supabase.rpc("link_child_by_invite_code", {
    code,
  })

  if (error) {
    return { message: "That invite code doesn't match any student." }
  }

  revalidatePath("/parent")
}

export async function updateParentProfile(
  _prevState: ParentProfileState,
  formData: FormData
): Promise<ParentProfileState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const validatedFields = ParentProfileSchema.safeParse({
    profession: formData.get("profession"),
    relationshipToStudent: formData.get("relationshipToStudent"),
    contactPreference: formData.get("contactPreference"),
  })

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors as Record<string, string[]> }
  }

  const { profession, relationshipToStudent, contactPreference } =
    validatedFields.data

  const { error } = await supabase
    .from("profiles")
    .update({
      profession,
      relationship_to_student: relationshipToStudent as Enums<"parent_relationship">,
      contact_preference: contactPreference as Enums<"contact_preference">,
    })
    .eq("id", user.id)

  if (error) {
    return { message: error.message }
  }

  revalidatePath("/parent")
}
