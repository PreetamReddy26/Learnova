"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { TrustBadge } from "@/components/trust-badge"
import { ReadAloudButton } from "@/components/assistant/read-aloud-button"
import { MarkdownMessage } from "@/components/assistant/markdown-message"
import { FOLLOW_UP_SUGGESTIONS } from "@/lib/assistant/suggestions"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

export function Chat({
  conversationId,
  initialMessages,
  curriculum,
}: {
  conversationId: string
  initialMessages: ChatMessage[]
  curriculum: string
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const nextIdRef = useRef(0)

  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])

  async function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || isStreaming) return

    setInput("")
    setMessages((prev) => [
      ...prev,
      { id: `user-${nextIdRef.current++}`, role: "user", content: trimmed },
    ])
    setIsStreaming(true)

    const assistantId = `assistant-${nextIdRef.current++}`
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }])

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, message: trimmed }),
        signal: controller.signal,
      })

      if (!response.body) return
      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m
          )
        )
      }
    } catch {
      // Aborted or network error — the partial reply already rendered stays visible.
    } finally {
      setIsStreaming(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-6 sm:px-10">
        {messages.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <p className="text-muted-foreground">
              Ask anything about your curriculum to get started.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {FOLLOW_UP_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                  className="rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
              "flex flex-col gap-1.5",
              message.role === "user" ? "items-end" : "items-start"
            )}
          >
            <div
              className={cn(
                "max-w-lg rounded-2xl px-4 py-2.5 text-sm",
                message.role === "user"
                  ? "whitespace-pre-wrap bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              )}
            >
              {message.role === "assistant" ? (
                message.content ? (
                  <MarkdownMessage content={message.content} />
                ) : isStreaming ? (
                  "…"
                ) : (
                  ""
                )
              ) : (
                message.content
              )}
            </div>
            {message.role === "assistant" && message.content && (
              <div className="flex items-center gap-3 px-1">
                <TrustBadge curriculum={curriculum} />
                <ReadAloudButton text={message.content} />
              </div>
            )}
          </motion.div>
        ))}
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          sendMessage(input)
        }}
        className="flex items-end gap-2 border-t border-border px-6 py-4 sm:px-10"
      >
        <Textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault()
              sendMessage(input)
            }
          }}
          placeholder="Ask a question about your syllabus..."
          className="min-h-11 flex-1 resize-none"
        />
        <Button type="submit" size="icon" disabled={isStreaming || !input.trim()}>
          <ArrowUp />
        </Button>
      </form>
    </div>
  )
}
