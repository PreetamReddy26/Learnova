import { Hero } from "@/components/marketing/hero"
import { ProductOverview } from "@/components/marketing/product-overview"
import { ProblemSection } from "@/components/marketing/problem-section"
import { AiSupportsTeachers } from "@/components/marketing/ai-supports-teachers"
import { CurriculumValidation } from "@/components/marketing/curriculum-validation"
import { Features } from "@/components/marketing/features"
import { Benefits } from "@/components/marketing/benefits"
import { Stats } from "@/components/marketing/stats"
import { Faq } from "@/components/marketing/faq"
import { Cta } from "@/components/marketing/cta"

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductOverview />
      <ProblemSection />
      <AiSupportsTeachers />
      <CurriculumValidation />
      <Features />
      <Benefits />
      <Stats />
      <Faq />
      <Cta />
    </>
  )
}
