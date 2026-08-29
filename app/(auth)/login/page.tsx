import { LoginForm } from "@/components/auth/login-form"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <span className="text-sm font-medium text-brand">Welcome back</span>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Log in
        </h1>
      </div>
      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
          {error}
        </p>
      )}
      <LoginForm />
    </div>
  )
}
