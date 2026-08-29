import { Badge } from "@/components/ui/badge"
import { SectionHeading } from "@/components/marketing/section-heading"

const CURRICULA = ["CBSE", "ICSE", "ISC", "Cambridge", "Telangana State Board"]

export function CurriculumValidation() {
  return (
    <section className="flex flex-col items-center gap-8 bg-muted/40 px-6 py-20 sm:px-10">
      <SectionHeading
        eyebrow="Curriculum accuracy"
        title="Every answer is checked against your actual syllabus"
        description="Learnova doesn't answer questions the way a generic model would. Each supported board has its own curated knowledge base, reviewed by subject-matter experts for that board, so explanations match expected structure, depth, and terminology."
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
