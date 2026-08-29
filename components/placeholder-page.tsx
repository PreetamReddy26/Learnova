import type { ReactNode } from "react"

interface PlaceholderPageProps {
  eyebrow: string
  title: string
  description: string
  children?: ReactNode
}

export function PlaceholderPage({
  eyebrow,
  title,
  description,
  children,
}: PlaceholderPageProps) {
  return (
    <div className="flex flex-1 flex-col items-start justify-center gap-3 px-6 py-24 sm:px-10">
      <span className="text-sm font-medium text-brand">{eyebrow}</span>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      <p className="max-w-xl text-base text-muted-foreground">{description}</p>
      {children}
    </div>
  )
}
