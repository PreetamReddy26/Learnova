import type { ReactNode } from "react"
import Link from "next/link"
import { Footer } from "@/components/marketing/footer"

export default function MarketingLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-border px-6 py-4 sm:px-10">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Learnova
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/login" className="hover:text-foreground">
            Log in
          </Link>
          <Link href="/signup" className="hover:text-foreground">
            Sign up
          </Link>
        </nav>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  )
}
