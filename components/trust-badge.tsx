import { ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

export function TrustBadge({
  curriculum,
  className,
}: {
  curriculum: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs text-muted-foreground",
        className
      )}
    >
      <ShieldCheck className="size-3.5 shrink-0 text-brand" />
      AI-generated for {curriculum} · Always confirm with your teacher
    </div>
  )
}
