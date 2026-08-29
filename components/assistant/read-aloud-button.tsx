"use client"

import { useState } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { stripMarkdownForSpeech } from "@/lib/assistant/strip-markdown"

export function ReadAloudButton({ text }: { text: string }) {
  const [isSpeaking, setIsSpeaking] = useState(false)

  function handleClick() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(stripMarkdownForSpeech(text))
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isSpeaking ? "Stop reading aloud" : "Read answer aloud"}
      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
    >
      {isSpeaking ? (
        <VolumeX className="size-3.5" />
      ) : (
        <Volume2 className="size-3.5" />
      )}
      {isSpeaking ? "Stop" : "Read aloud"}
    </button>
  )
}
