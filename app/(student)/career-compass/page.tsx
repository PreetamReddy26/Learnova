import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CAREER_PATHS, STREAMS } from "@/lib/career-content"

export default async function CareerCompassPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("grade")
    .eq("id", user!.id)
    .single()

  const unlocked = (profile?.grade ?? 0) >= 11

  if (!unlocked) {
    return (
      <div className="flex flex-1 flex-col gap-2 px-6 py-10 sm:px-10">
        <span className="text-sm font-medium text-brand">Student</span>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Career Compass
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          Career Compass unlocks in Grade 11, once career and stream
          decisions become more immediate. Update your grade in your Profile
          if this doesn&apos;t look right.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-8 px-6 py-10 sm:px-10">
      <div>
        <span className="text-sm font-medium text-brand">Grades 11-12</span>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Career Compass
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Explore career paths, what the day-to-day work looks like, and
          where demand is heading. This is here to inform your thinking, not
          to recommend specific colleges or courses.
        </p>
      </div>

      {STREAMS.map((stream) => {
        const paths = CAREER_PATHS.filter((path) => path.stream === stream)
        if (paths.length === 0) return null

        return (
          <div key={stream} className="flex flex-col gap-3">
            <Badge variant="outline" className="w-fit">
              {stream}
            </Badge>
            <Accordion className="w-full max-w-2xl">
              {paths.map((path) => (
                <AccordionItem key={path.id} value={path.id}>
                  <AccordionTrigger>{path.title}</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-3">
                      <p>{path.summary}</p>
                      <div>
                        <span className="font-medium text-foreground">
                          What the work looks like:{" "}
                        </span>
                        {path.dailyWork}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">
                          Useful skills:{" "}
                        </span>
                        {path.requiredSkills.join(", ")}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">
                          Growth outlook:{" "}
                        </span>
                        {path.growthOutlook}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">
                          Typical pathway:{" "}
                        </span>
                        {path.typicalPathway}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )
      })}
    </div>
  )
}
