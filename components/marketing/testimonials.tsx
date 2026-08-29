import { SectionHeading } from "@/components/marketing/section-heading"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Illustrative placeholder quotes for the pre-launch build — swap for real,
// consented testimonials before this page goes live.
const TESTIMONIALS = [
  {
    quote:
      "The explanations finally match how my ICSE answers are supposed to be structured. That alone saved me so much rewriting.",
    name: "Aditi R.",
    detail: "Class 10 · ICSE",
  },
  {
    quote:
      "I can see exactly which chapters my son is behind on without having to ask him every evening.",
    name: "Farah K.",
    detail: "Parent",
  },
  {
    quote:
      "My students come to class having already reviewed the tricky bits — it changes how far we can get in a period.",
    name: "Mr. Suresh N.",
    detail: "Physics teacher · CBSE",
  },
]

export function Testimonials() {
  return (
    <section className="flex flex-col items-center gap-12 px-6 py-20 sm:px-10">
      <SectionHeading eyebrow="Early feedback" title="What the first cohort is saying" />
      <div className="grid w-full max-w-5xl gap-4 sm:grid-cols-3">
        {TESTIMONIALS.map(({ quote, name, detail }) => (
          <Card key={name}>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-foreground">&ldquo;{quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium text-foreground">{name}</div>
                  <div className="text-muted-foreground">{detail}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
