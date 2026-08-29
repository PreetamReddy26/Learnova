import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { OnboardingWizard } from "@/components/auth/onboarding-wizard"
import { ROLE_HOME } from "@/lib/roles"

export default async function OnboardingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const [{ data: profile }, { data: curricula }] = await Promise.all([
    supabase.from("profiles").select("role").eq("id", user.id).single(),
    supabase.from("curricula").select("id, name").order("name"),
  ])

  const role = profile?.role ?? "student"

  // Parents have nothing to configure here — their setup is linking a
  // child via invite code on the Parent Dashboard.
  if (role === "parent") {
    redirect(ROLE_HOME.parent)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <span className="text-sm font-medium text-brand">One last step</span>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Set up your profile
        </h1>
      </div>
      <OnboardingWizard role={role} curricula={curricula ?? []} />
    </div>
  )
}
