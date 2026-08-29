import { Users, ShieldCheck, RefreshCw } from "lucide-react"
import { SectionHeading } from "@/components/marketing/section-heading"

const PILLARS = [
  {
    icon: Users,
    title: "Teachers stay central",
    description:
      "Learnova is the extra help at 9pm before homework is due — not a substitute for classroom teaching. It's designed to make what your teacher already taught stick better.",
  },
  {
    icon: ShieldCheck,
    title: "Curriculum experts review every model",
    description:
      "Subject-matter experts for each board check how the AI answers, not just whether it's correct — so explanations match how your syllabus expects you to think and write.",
  },
  {
    icon: RefreshCw,
    title: "Updated on every syllabus revision",
    description:
      "When a board revises its syllabus, Learnova's content is re-validated against the new requirements before students see it.",
  },
]

export function AiSupportsTeachers() {
  return (
    <section className="flex flex-col items-center gap-12 px-6 py-20 sm:px-10">
      <SectionHeading
        eyebrow="Our philosophy"
        title="AI supports your teacher. It never replaces them."
        description="Every feature in Learnova is built around one rule: reinforce what happens in the classroom, don't compete with it."
      />
      <div className="grid w-full max-w-4xl gap-8 sm:grid-cols-3">
        {PILLARS.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex flex-col gap-3">
            <div className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Icon className="size-5" />
            </div>
            <h3 className="font-heading text-base font-medium text-foreground">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
