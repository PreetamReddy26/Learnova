import { GraduationCap, HeartHandshake, Presentation, Check } from "lucide-react"
import { SectionHeading } from "@/components/marketing/section-heading"
import { Card, CardContent } from "@/components/ui/card"

const AUDIENCES = [
  {
    icon: GraduationCap,
    title: "For students",
    points: [
      "Answers in the learning style that works for you",
      "A study plan that points you at your weakest subject",
      "Practice questions shaped around your board and grade",
    ],
  },
  {
    icon: HeartHandshake,
    title: "For parents",
    points: [
      "Clear visibility into study hours and progress",
      "Progress reports without needing to ask your child",
      "A clear flag on the subject that needs attention",
    ],
  },
  {
    icon: Presentation,
    title: "For teachers",
    points: [
      "Class-wide analytics on where students are struggling",
      "Class codes and assignments set up in minutes, not hours",
      "A tool that reinforces your lessons instead of replacing them",
    ],
  },
]

export function Benefits() {
  return (
    <section className="flex flex-col items-center gap-12 bg-muted/40 px-6 py-20 sm:px-10">
      <SectionHeading eyebrow="Built for everyone" title="One platform, three roles" />
      <div className="grid w-full max-w-5xl gap-4 sm:grid-cols-3">
        {AUDIENCES.map(({ icon: Icon, title, points }) => (
          <Card key={title}>
            <CardContent className="flex flex-col gap-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="size-5" />
              </div>
              <h3 className="font-heading text-base font-medium text-foreground">
                {title}
              </h3>
              <ul className="flex flex-col gap-2">
                {points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                    {point}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
