import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <span className="text-sm font-medium text-brand">Get started</span>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Create your account
        </h1>
      </div>
      <SignupForm />
    </div>
  )
}
