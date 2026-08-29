import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Chat } from "@/components/assistant/chat"

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>
}) {
  const { conversationId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: conversation }, { data: messages }, { data: profile }] =
    await Promise.all([
      supabase
        .from("conversations")
        .select("id")
        .eq("id", conversationId)
        .single(),
      supabase
        .from("messages")
        .select("id, role, content")
        .eq("conversation_id", conversationId)
        .order("created_at"),
      supabase
        .from("profiles")
        .select("curricula(name)")
        .eq("id", user!.id)
        .single(),
    ])

  if (!conversation) {
    notFound()
  }

  return (
    <Chat
      conversationId={conversationId}
      initialMessages={messages ?? []}
      curriculum={profile?.curricula?.name ?? "your curriculum"}
    />
  )
}
