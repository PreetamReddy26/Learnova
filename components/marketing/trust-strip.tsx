import { ShieldCheck, Users, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

const POINTS = [
  { icon: Users, label: "Teachers stay central — AI only supports them" },
  { icon: ShieldCheck, label: "Every answer reviewed by curriculum experts" },
  { icon: RefreshCw, label: "Content updated on every syllabus revision" },
]

export function TrustStrip({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col flex-wrap items-center gap-x-8 gap-y-3 sm:flex-row sm:justify-center",
        className
      )}
    >
      {POINTS.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Icon className="size-4 text-brand" />
          {label}
        </div>
      ))}
    </div>
  )
}
