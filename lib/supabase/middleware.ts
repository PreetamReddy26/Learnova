import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const PROTECTED_PREFIXES = [
  "/onboarding",
  "/dashboard",
  "/assistant",
  "/planner",
  "/tests",
  "/reports",
  "/career-compass",
  "/profile",
  "/parent",
  "/teacher",
  "/admin",
]

const AUTH_ROUTES = ["/login", "/signup"]

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refreshes the session token and syncs it back to cookies — required
  // on every request per the Supabase SSR proxy/middleware pattern.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    path.startsWith(prefix)
  )
  const isAuthRoute = AUTH_ROUTES.some((prefix) => path.startsWith(prefix))

  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return response
}
