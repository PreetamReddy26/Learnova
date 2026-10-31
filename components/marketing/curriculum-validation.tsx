import { Badge } from "@/components/ui/badge"
import { SectionHeading } from "@/components/marketing/section-heading"

const CURRICULA = ["CBSE", "ICSE", "ISC", "Cambridge", "Telangana State Board"]

export function CurriculumValidation() {
  return (
    <section className="flex flex-col items-center gap-8 bg-muted/40 px-6 py-20 sm:px-10">
      <SectionHeading
        eyebrow="Curriculum-aware"
        title="Answers shaped around your board and grade"
        description="Learnova tailors explanations and practice questions to the curriculum, grade and learning style you choose. It is AI-generated, so it can make mistakes: always confirm important answers with your teacher or textbook."
      />
      <div className="flex flex-wrap items-center justify-center gap-3">
        {CURRICULA.map((name) => (
          <Badge key={name} variant="outline" className="h-7 px-3 text-sm">
            {name}
          </Badge>
        ))}
      </div>
    </section>
  )
}
