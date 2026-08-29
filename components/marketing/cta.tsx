import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

export function Cta() {
  return (
    <section className="flex flex-col items-center gap-6 px-6 py-20 text-center sm:px-10">
      <h2 className="max-w-xl text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Start your first AI study session today
      </h2>
      <p className="max-w-md text-muted-foreground">
        Free to create an account. Pick your curriculum and learning style,
        and ask your first question in under a minute.
      </p>
      <Link href="/signup" className={buttonVariants({ size: "lg" })}>
        Start learning free
        <ArrowRight />
      </Link>
    </section>
  )
}
