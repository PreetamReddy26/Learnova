import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/profile/profile-form"
import { JoinClassForm } from "@/components/profile/join-class-form"
import { ReadingModeToggle } from "@/components/profile/reading-mode-toggle"
import { AchievementBadges } from "@/components/gamification/achievement-badges"
import { computeAchievements, computeStreak } from "@/lib/gamification"

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: profile }, { data: curricula }, { data: attempts }, { data: xpEvents }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select(
          "full_name, phone, school_name, city, curriculum_id, grade, learning_style, invite_code"
        )
        .eq("id", user!.id)
        .single(),
      supabase.from("curricula").select("id, name").order("name"),
      supabase
        .from("quiz_attempts")
        .select("score, total")
        .eq("student_id", user!.id),
      supabase
        .from("xp_events")
        .select("created_at")
        .eq("student_id", user!.id),
    ])

  const scorePercents = (attempts ?? []).map((a) => (a.score / a.total) * 100)
  const bestScorePercent = scorePercents.length > 0 ? Math.max(...scorePercents) : 0
  const streak = computeStreak((xpEvents ?? []).map((e) => e.created_at))
  const achievements = computeAchievements({
    quizCount: attempts?.length ?? 0,
    bestScorePercent,
    streak,
    xpEventCount: xpEvents?.length ?? 0,
  })

  return (
    <div className="flex flex-1 flex-col gap-10 px-6 py-10 sm:px-10">
      <div>
        <span className="text-sm font-medium text-brand">Student</span>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Profile
        </h1>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-border px-4 py-3">
        <span className="text-sm font-medium text-foreground">
          Invite code for parents
        </span>
        <p className="text-sm text-muted-foreground">
          Share this code with a parent so they can link their account to
          yours and view your progress.
        </p>
        <span className="w-fit rounded-md bg-muted px-3 py-1.5 font-mono text-lg tracking-widest text-foreground">
          {profile?.invite_code}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Join a class
        </h2>
        <JoinClassForm />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-muted-foreground">
          Edit profile
        </h2>
        <ProfileForm
          fullName={profile?.full_name ?? ""}
          phone={profile?.phone ?? null}
          schoolName={profile?.school_name ?? null}
          city={profile?.city ?? null}
          curriculumId={profile?.curriculum_id ?? null}
          grade={profile?.grade ?? null}
          learningStyle={profile?.learning_style ?? null}
          curricula={curricula ?? []}
        />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-muted-foreground">
          Achievements
        </h2>
        <AchievementBadges achievements={achievements} />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-muted-foreground">
          Accessibility
        </h2>
        <ReadingModeToggle />
      </div>
    </div>
  )
}
