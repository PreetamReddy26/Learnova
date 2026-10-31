import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrustStrip } from "@/components/marketing/trust-strip"
import { FadeIn } from "@/components/motion/fade-in"

export function Hero() {
  return (
    <section className="flex flex-col items-center gap-8 px-6 py-20 text-center sm:px-10 sm:py-28">
      <FadeIn>
        <Badge variant="secondary" className="text-brand">
          Built with teachers, not instead of them
        </Badge>
      </FadeIn>
      <FadeIn delay={0.1}>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-6xl">
          The AI study partner that knows your board and your grade
        </h1>
      </FadeIn>
      <FadeIn delay={0.2}>
        <p className="max-w-2xl text-lg text-muted-foreground text-balance">
          Learnova gives every CBSE, ICSE, ISC, Cambridge, or Telangana State
          Board student a personalized tutor, study planner, and practice
          engine — tuned to their curriculum, grade and the way they learn
          best, not a generic chatbot response.
        </p>
      </FadeIn>
      <FadeIn delay={0.3}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/signup" className={buttonVariants({ size: "lg" })}>
            Start learning free
            <ArrowRight />
          </Link>
          <Link
            href="#features"
            className={buttonVariants({ size: "lg", variant: "outline" })}
          >
            See how it works
          </Link>
        </div>
      </FadeIn>
      <FadeIn delay={0.4}>
        <TrustStrip className="pt-4" />
      </FadeIn>
    </section>
  )
}
