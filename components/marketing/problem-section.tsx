import { SectionHeading } from "@/components/marketing/section-heading"
import { Card, CardContent } from "@/components/ui/card"

const PROBLEMS = [
  {
    title: "Generic answers, specific exams",
    description:
      "A general-purpose chatbot doesn't know that your board wants a labelled diagram, a derivation in a specific order, or a particular word limit.",
  },
  {
    title: "No memory of what's hard for you",
    description:
      "Every question starts from zero. Nothing carries over from the chapter you struggled with last week.",
  },
  {
    title: "Studying without a plan",
    description:
      "Revision happens in bursts before exams, not as a steady plan built around what's actually improving.",
  },
]

export function ProblemSection() {
  return (
    <section className="flex flex-col items-center gap-12 bg-muted/40 px-6 py-20 sm:px-10">
      <SectionHeading
        eyebrow="The problem"
        title="Studying with AI usually means studying off-syllabus"
        description="Most AI tools were built for general knowledge, not for how a specific board grades a specific answer."
      />
      <div className="grid w-full max-w-4xl gap-4 sm:grid-cols-3">
        {PROBLEMS.map(({ title, description }) => (
          <Card key={title}>
            <CardContent className="flex flex-col gap-2">
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
