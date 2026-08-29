import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/empty-state"
import { createConversation } from "@/app/(student)/assistant/actions"

export default async function AssistantPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: conversations } = await supabase
    .from("conversations")
    .select("id, title, updated_at")
    .eq("student_id", user!.id)
    .order("updated_at", { ascending: false })

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-10 sm:px-10">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-brand">Student</span>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            AI Learning Assistant
          </h1>
        </div>
        <form action={createConversation}>
          <Button type="submit">New chat</Button>
        </form>
      </div>

      {conversations && conversations.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {conversations.map((conversation) => (
            <li key={conversation.id}>
              <Link
                href={`/assistant/${conversation.id}`}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3 hover:bg-muted"
              >
                <span className="text-sm font-medium text-foreground">
                  {conversation.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(conversation.updated_at).toLocaleDateString()}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          message="No conversations yet — ask your first question to get started."
          action={
            <form action={createConversation}>
              <Button type="submit">Start a conversation</Button>
            </form>
          }
        />
      )}
    </div>
  )
}
