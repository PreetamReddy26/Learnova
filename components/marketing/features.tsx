import {
  MessageCircle,
  CalendarClock,
  ClipboardCheck,
  BarChart3,
  Compass,
  Flame,
} from "lucide-react"
import { SectionHeading } from "@/components/marketing/section-heading"
import { Card, CardContent } from "@/components/ui/card"

const FEATURES = [
  {
    icon: MessageCircle,
    title: "AI Learning Assistant",
    description:
      "Ask a question and get an answer adapted to your curriculum and preferred learning style — visual, step-by-step, story-based, and more.",
  },
  {
    icon: CalendarClock,
    title: "AI Study Planner",
    description:
      "An agenda for your study tasks and goals, plus a suggested plan that targets the subject where your quiz scores are lowest.",
  },
  {
    icon: ClipboardCheck,
    title: "Tests & Quizzes",
    description:
      "AI-generated multiple-choice and written-answer practice for your board and grade, in the length you choose, with instant feedback on written answers.",
  },
  {
    icon: BarChart3,
    title: "Performance Reports",
    description:
      "Score trends and subject-level breakdowns of your strengths and weaker areas — built to motivate, not discourage.",
  },
  {
    icon: Compass,
    title: "Career Compass",
    description:
      "For grades 11 and 12: career paths, in-demand skills, and industry growth — no college rankings, just clarity on options.",
  },
  {
    icon: Flame,
    title: "Streaks & Achievements",
    description:
      "XP, streaks, and badges that reward consistency — personal progress first, no public rankings.",
  },
]

export function Features() {
  return (
    <section id="features" className="flex flex-col items-center gap-12 px-6 py-20 sm:px-10">
      <SectionHeading
        eyebrow="Platform"
        title="Everything a student needs between classes"
      />
      <div className="grid w-full max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <Card key={title}>
            <CardContent className="flex flex-col gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="size-5" />
              </div>
              <h3 className="font-heading text-base font-medium text-foreground">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
