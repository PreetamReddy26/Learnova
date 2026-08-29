import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  eyebrow: string
  title: string
  description?: string
  align?: "left" | "center"
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <Badge variant="secondary" className="text-brand">
        {eyebrow}
      </Badge>
      <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-base text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )
}
