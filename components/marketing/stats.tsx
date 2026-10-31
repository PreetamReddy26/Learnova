const STATS = [
  { value: "5", label: "Curricula supported" },
  { value: "2", label: "Quiz formats: multiple choice and written" },
  { value: "3", label: "Role-based dashboards" },
  { value: "0", label: "Teachers replaced" },
]

export function Stats() {
  return (
    <section className="flex flex-col items-center gap-10 bg-muted/40 px-6 py-20 sm:px-10">
      <div className="grid w-full max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
        {STATS.map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center gap-1 text-center">
            <span className="text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
              {value}
            </span>
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
