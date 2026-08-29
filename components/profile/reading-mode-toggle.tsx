"use client"

import { useSyncExternalStore } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

let listeners: Array<() => void> = []

function subscribe(callback: () => void) {
  listeners.push(callback)
  return () => {
    listeners = listeners.filter((listener) => listener !== callback)
  }
}

function getSnapshot() {
  return document.documentElement.getAttribute("data-reading-mode") === "dyslexia"
}

function getServerSnapshot() {
  return false
}

function setReadingMode(enabled: boolean) {
  if (enabled) {
    document.documentElement.setAttribute("data-reading-mode", "dyslexia")
    localStorage.setItem("reading-mode", "dyslexia")
  } else {
    document.documentElement.removeAttribute("data-reading-mode")
    localStorage.removeItem("reading-mode")
  }
  listeners.forEach((listener) => listener())
}

export function ReadingModeToggle() {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
      <Switch id="reading-mode" checked={enabled} onCheckedChange={setReadingMode} />
      <div>
        <Label htmlFor="reading-mode" className="font-medium text-foreground">
          Dyslexia-friendly reading mode
        </Label>
        <p className="text-sm text-muted-foreground">
          Switches to a more legible typeface with extra letter and line
          spacing, sitewide.
        </p>
      </div>
    </div>
  )
}
