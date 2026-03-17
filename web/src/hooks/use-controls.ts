"use client"

import { useCallback, useState } from "react"
import { sendControl as sendControlAction } from "@/services/music"

type ControlAction = "pause" | "resume" | "skip" | "back" | "volume" | "seek"

export const useControls = () => {
  const [error, setError] = useState<string | null>(null)

  const sendControl = useCallback(async ({ action, value }: { action: ControlAction; value?: number }) => {
    setError(null)
    try {
      await sendControlAction({ action, value })
    } catch {
      setError("Server unreachable")
      setTimeout(() => setError(null), 3000)
    }
  }, [])

  return { sendControl, error }
}
