import { MessageCircle, CalendarClock, ClipboardCheck, LineChart } from "lucide-react"
import { SectionHeading } from "@/components/marketing/section-heading"

const STEPS = [
  {
    icon: MessageCircle,
    title: "Ask",
    description: "Ask a doubt in plain language, in the style you learn best.",
  },
  {
    icon: CalendarClock,
    title: "Plan",
    description: "Get a study schedule built around your exams and weak spots.",
  },
  {
    icon: ClipboardCheck,
    title: "Practice",
    description: "Take adaptive quizzes that match your board's question style.",
  },
  {
    icon: LineChart,
    title: "Track",
    description: "See exactly where you improved, and what to revise next.",
  },
]

export function ProductOverview() {
  return (
    <section className="flex flex-col items-center gap-12 px-6 py-20 sm:px-10">
      <SectionHeading
        eyebrow="How it works"
        title="One companion, the whole learning loop"
        description="Learnova connects the four things a student actually needs between classes: help understanding, a plan to follow, practice that adapts, and proof of progress."
      />
      <div className="grid w-full max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
        {STEPS.map(({ icon: Icon, title, description }, index) => (
          <div key={title} className="flex flex-col items-center gap-3 text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Icon className="size-5" />
            </div>
            <div className="text-sm font-semibold text-foreground">
              {index + 1}. {title}
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
