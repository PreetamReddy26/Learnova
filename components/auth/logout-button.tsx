import { logout } from "@/app/(auth)/actions"
import { cn } from "@/lib/utils"

export function LogoutButton({ className }: { className?: string }) {
  return (
    <form action={logout}>
      <button
        type="submit"
        className={cn(
          "text-sm text-muted-foreground hover:text-foreground",
          className
        )}
      >
        Log out
      </button>
    </form>
  )
}
