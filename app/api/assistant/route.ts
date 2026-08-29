import type { NextRequest } from "next/server"
import OpenAI from "openai"
import { createClient } from "@/lib/supabase/server"
import { buildSystemPrompt } from "@/lib/assistant/system-prompt"

const MODEL = process.env.GEMINI_MODEL ?? "gemini-3.6-flash"
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { conversationId, message } = (await request.json()) as {
    conversationId: string
    message: string
  }

  const [{ data: profile }, { data: conversation }] = await Promise.all([
    supabase
      .from("profiles")
      .select("learning_style, grade, curricula(name)")
      .eq("id", user.id)
      .single(),
    supabase
      .from("conversations")
      .select("title")
      .eq("id", conversationId)
      .single(),
  ])

  const { error: insertUserMessageError } = await supabase
    .from("messages")
    .insert({ conversation_id: conversationId, role: "user", content: message })

  if (insertUserMessageError) {
    return new Response(insertUserMessageError.message, { status: 400 })
  }

  if (conversation?.title === "New conversation") {
    await supabase
      .from("conversations")
      .update({ title: message.slice(0, 60) })
      .eq("id", conversationId)
  }

  const { data: history } = await supabase
    .from("messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at")

  const systemPrompt = buildSystemPrompt({
    curriculum: profile?.curricula?.name ?? "your curriculum",
    grade: profile?.grade ?? null,
    learningStyle: profile?.learning_style ?? null,
  })

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      let fullAnswer = ""

      if (!process.env.GEMINI_API_KEY) {
        fullAnswer =
          "The AI Assistant isn't configured yet — a Gemini API key hasn't been set up."
        controller.enqueue(encoder.encode(fullAnswer))
        controller.close()
        await supabase
          .from("messages")
          .insert({ conversation_id: conversationId, role: "assistant", content: fullAnswer })
        await supabase
          .from("conversations")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", conversationId)
        return
      }

      try {
        const openai = new OpenAI({
          apiKey: process.env.GEMINI_API_KEY,
          baseURL: GEMINI_BASE_URL,
        })
        const completion = await openai.chat.completions.create({
          model: MODEL,
          stream: true,
          messages: [
            { role: "system", content: systemPrompt },
            ...(history ?? []).map((entry) => ({
              role: entry.role === "assistant" ? ("assistant" as const) : ("user" as const),
              content: entry.content,
            })),
          ],
        })

        for await (const chunk of completion) {
          const delta = chunk.choices[0]?.delta?.content ?? ""
          if (delta) {
            fullAnswer += delta
            controller.enqueue(encoder.encode(delta))
          }
        }
      } catch (error) {
        console.error("Assistant completion failed:", error)
        const fallback =
          "I couldn't reach the AI service just now. Please try again in a moment."
        controller.enqueue(encoder.encode(fallback))
        fullAnswer = fallback
      }

      controller.close()

      if (fullAnswer) {
        await supabase
          .from("messages")
          .insert({ conversation_id: conversationId, role: "assistant", content: fullAnswer })
        await supabase
          .from("conversations")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", conversationId)
      }
    },
  })

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
