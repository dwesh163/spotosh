"use server"

import type { HistoryItem } from "@/types/music"

const MUSIC_SERVER_URL = process.env.MUSIC_SERVER_URL ?? "http://localhost:4000"

type AddToQueueInput = {
  trackId: number
  title: string
  artist: string
  album: string
  artwork: string
  durationMs: number
}

export const sendControl = async ({ action, value }: { action: string; value?: number }) => {
  await fetch(`${MUSIC_SERVER_URL}/controls`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, value }),
  })
}

export const addToQueue = async (input: AddToQueueInput) => {
  await fetch(`${MUSIC_SERVER_URL}/queue`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
}

export const removeFromQueue = async (id: string) => {
  await fetch(`${MUSIC_SERVER_URL}/queue/${id}`, { method: "DELETE" })
}

export const getHistory = async (): Promise<HistoryItem[]> => {
  try {
    const res = await fetch(`${MUSIC_SERVER_URL}/history`, { cache: "no-store" })
    return res.json() as Promise<HistoryItem[]>
  } catch {
    return []
  }
}

export const removeFromHistory = async (id: string) => {
  await fetch(`${MUSIC_SERVER_URL}/history/${id}`, { method: "DELETE" })
}
