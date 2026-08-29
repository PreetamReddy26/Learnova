"use server"

import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import type { Enums } from "@/lib/supabase/types"
import { ROLE_HOME } from "@/lib/roles"
import {
  LoginSchema,
  SignupSchema,
  TeacherOnboardingSchema,
  StudentOnboardingSchema,
  ForgotPasswordSchema,
  UpdatePasswordSchema,
  type LoginState,
  type OnboardingState,
  type SignupState,
  type ForgotPasswordState,
  type UpdatePasswordState,
} from "@/lib/validations/auth"

async function getSiteOrigin() {
  const headersList = await headers()
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") ?? "http"
  return `${protocol}://${host}`
}

export async function signup(
  _prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const validatedFields = SignupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone"),
    role: formData.get("role"),
  })

  if (!validatedFields.success) {
    return { errors: flattenZodError(validatedFields.error) }
  }

  const { fullName, email, password, phone, role } = validatedFields.data
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, phone, role },
    },
  })

  if (error) {
    return { message: error.message }
  }

  if (!data.session) {
    return {
      message:
        "Check your email to confirm your account before continuing.",
    }
  }

  // Parents don't need a school/curriculum setup step — their real
  // "onboarding" is linking a child via invite code on their dashboard.
  if (role === "parent") {
    redirect(ROLE_HOME.parent)
  }

  redirect("/onboarding")
}

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return { errors: flattenZodError(validatedFields.error) }
  }

  const supabase = await createClient()
  const { data: signInData, error } = await supabase.auth.signInWithPassword(
    validatedFields.data
  )

  if (error) {
    return { message: "Invalid email or password." }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, curriculum_id")
    .eq("id", signInData.user.id)
    .single()

  if (!profile?.curriculum_id && profile?.role === "student") {
    redirect("/onboarding")
  }

  redirect(ROLE_HOME[profile?.role ?? "student"])
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}

export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const validatedFields = ForgotPasswordSchema.safeParse({
    email: formData.get("email"),
  })

  if (!validatedFields.success) {
    return { errors: flattenZodError(validatedFields.error) }
  }

  const supabase = await createClient()
  const origin = await getSiteOrigin()

  await supabase.auth.resetPasswordForEmail(validatedFields.data.email, {
    redirectTo: `${origin}/update-password`,
  })

  // Always report success regardless of whether the email is registered —
  // revealing that would let an attacker enumerate real accounts.
  return {
    message:
      "If an account exists for that email, a password reset link is on its way.",
  }
}

export async function updatePassword(
  _prevState: UpdatePasswordState,
  formData: FormData
): Promise<UpdatePasswordState> {
  const validatedFields = UpdatePasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  })

  if (!validatedFields.success) {
    return { errors: flattenZodError(validatedFields.error) }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.auth.updateUser({
    password: validatedFields.data.password,
  })

  if (error) {
    return { message: error.message }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  redirect(ROLE_HOME[profile?.role ?? "student"])
}

export async function completeOnboarding(
  _prevState: OnboardingState,
  formData: FormData
): Promise<OnboardingState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  const role = profile?.role ?? "student"

  // Parents skip this wizard entirely — their setup is linking a child via
  // invite code on the Parent Dashboard.
  if (role === "parent") {
    redirect(ROLE_HOME.parent)
  }

  if (role === "student") {
    const validatedFields = StudentOnboardingSchema.safeParse({
      schoolName: formData.get("schoolName"),
      city: formData.get("city"),
      curriculumId: formData.get("curriculumId"),
      grade: formData.get("grade"),
      learningStyle: formData.get("learningStyle"),
    })

    if (!validatedFields.success) {
      return { errors: flattenZodError(validatedFields.error) }
    }

    const { schoolName, city, curriculumId, grade, learningStyle } =
      validatedFields.data

    const { error } = await supabase
      .from("profiles")
      .update({
        school_name: schoolName,
        city,
        curriculum_id: curriculumId,
        grade,
        learning_style: learningStyle as Enums<"learning_style">,
      })
      .eq("id", user.id)

    if (error) {
      return { message: error.message }
    }

    redirect(ROLE_HOME.student)
  }

  const validatedFields = TeacherOnboardingSchema.safeParse({
    schoolName: formData.get("schoolName"),
    city: formData.get("city"),
  })

  if (!validatedFields.success) {
    return { errors: flattenZodError(validatedFields.error) }
  }

  const { schoolName, city } = validatedFields.data

  const { error } = await supabase
    .from("profiles")
    .update({ school_name: schoolName, city })
    .eq("id", user.id)

  if (error) {
    return { message: error.message }
  }

  redirect(ROLE_HOME[role])
}

function flattenZodError(error: {
  flatten: () => { fieldErrors: Record<string, string[] | undefined> }
}) {
  return error.flatten().fieldErrors as Record<string, string[]>
}
