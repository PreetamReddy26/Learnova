import Link from "next/link"

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "AI Assistant", href: "/#features" },
      { label: "Study Planner", href: "/#features" },
      { label: "Career Compass", href: "/#features" },
      { label: "Sign up", href: "/signup" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our philosophy", href: "/#features" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-12 sm:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Learnova
          </span>
          <p className="max-w-xs text-sm text-muted-foreground">
            AI that supports teachers, personalizes learning, and never
            replaces the classroom.
          </p>
        </div>
        <div className="flex gap-16">
          {COLUMNS.map((column) => (
            <div key={column.title} className="flex flex-col gap-2">
              <span className="text-sm font-medium text-foreground">
                {column.title}
              </span>
              {column.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-5xl text-xs text-muted-foreground">
        Learnova is not affiliated with CBSE, ICSE, ISC, Cambridge Assessment,
        or the Telangana State Board.
      </p>
    </footer>
  )
}
