import * as z from "zod"

export const SignupSchema = z.object({
  fullName: z.string().trim().min(2, { error: "Enter your full name." }),
  email: z.email({ error: "Enter a valid email address." }).trim(),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters." })
    .regex(/[0-9]/, { error: "Password must include a number." }),
  phone: z.string().trim().min(7, { error: "Enter a valid phone number." }),
  role: z.enum(["student", "parent", "teacher"], {
    error: "Choose who you are.",
  }),
})

export type SignupState =
  | {
      errors?: {
        fullName?: string[]
        email?: string[]
        password?: string[]
        phone?: string[]
        role?: string[]
      }
      message?: string
    }
  | undefined

export const LoginSchema = z.object({
  email: z.email({ error: "Enter a valid email address." }).trim(),
  password: z.string().min(1, { error: "Enter your password." }),
})

export type LoginState =
  | {
      errors?: {
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

export const ForgotPasswordSchema = z.object({
  email: z.email({ error: "Enter a valid email address." }).trim(),
})

export type ForgotPasswordState =
  | {
      errors?: { email?: string[] }
      message?: string
    }
  | undefined

export const UpdatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { error: "Password must be at least 8 characters." })
      .regex(/[0-9]/, { error: "Password must include a number." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords don't match.",
    path: ["confirmPassword"],
  })

export type UpdatePasswordState =
  | {
      errors?: { password?: string[]; confirmPassword?: string[] }
      message?: string
    }
  | undefined

export const LEARNING_STYLES = [
  { value: "visual", label: "Visual" },
  { value: "step_by_step", label: "Step-by-step" },
  { value: "real_world", label: "Real-world examples" },
  { value: "story_based", label: "Story-based" },
  { value: "activities", label: "Activities" },
  { value: "hands_on", label: "Hands-on" },
  { value: "beginner", label: "Beginner-friendly" },
  { value: "advanced", label: "Advanced" },
] as const

export const StudentOnboardingSchema = z.object({
  schoolName: z.string().trim().min(1, { error: "Enter your school name." }),
  city: z.string().trim().min(1, { error: "Enter your city." }),
  curriculumId: z.uuid({ error: "Choose your curriculum." }),
  grade: z.coerce
    .number({ error: "Choose your grade." })
    .int()
    .min(1)
    .max(12),
  learningStyle: z.enum(
    LEARNING_STYLES.map((style) => style.value) as [string, ...string[]],
    { error: "Choose a learning style." }
  ),
})

export const TeacherOnboardingSchema = z.object({
  schoolName: z.string().trim().min(1, { error: "Enter your school name." }),
  city: z.string().trim().min(1, { error: "Enter your city." }),
})

export type OnboardingState =
  | {
      errors?: Record<string, string[]>
      message?: string
    }
  | undefined

export const PARENT_RELATIONSHIPS = [
  { value: "mother", label: "Mother" },
  { value: "father", label: "Father" },
  { value: "guardian", label: "Guardian" },
  { value: "other", label: "Other" },
] as const

export const CONTACT_PREFERENCES = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone call" },
  { value: "whatsapp", label: "WhatsApp" },
] as const

export const ParentProfileSchema = z.object({
  profession: z.string().trim().min(1, { error: "Enter your profession." }),
  relationshipToStudent: z.enum(
    PARENT_RELATIONSHIPS.map((option) => option.value) as [
      string,
      ...string[],
    ],
    { error: "Choose your relationship to the student." }
  ),
  contactPreference: z.enum(
    CONTACT_PREFERENCES.map((option) => option.value) as [string, ...string[]],
    { error: "Choose a preferred contact method." }
  ),
})

export type ParentProfileState =
  | {
      errors?: Record<string, string[]>
      message?: string
    }
  | undefined
