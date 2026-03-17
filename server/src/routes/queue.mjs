import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import { state, getState, broadcast } from '../state.mjs'
import { playItem } from '../playback.mjs'

const router = Router()

const MAX_QUEUE = 1000

router.get('/', (_req, res) => res.json(getState()))

router.post('/', (req, res) => {
  const { trackId, title, artist, album, artwork, durationMs } = req.body

  if (!trackId || !title) {
    return res.status(400).json({ error: 'trackId and title are required' })
  }
  if (state.queue.length >= MAX_QUEUE) {
    return res.status(429).json({ error: `Queue is full (max ${MAX_QUEUE})` })
  }

  const item = {
    id:         randomUUID(),
    trackId,
    title,
    artist:     artist     ?? '',
    album:      album      ?? '',
    artwork:    artwork     ?? '',
    durationMs: durationMs ?? 0,
    addedAt:    Date.now(),
  }

  state.queue.push(item)

  if (!state.isPlaying) {
    playItem(item)
    return res.status(201).json(item)
  }

  broadcast()
  res.status(201).json(item)
})

router.delete('/:id', (req, res) => {
  const before = state.queue.length
  state.queue = state.queue.filter(i => i.id !== req.params.id)
  if (state.queue.length === before) return res.status(404).json({ error: 'Not found' })
  broadcast()
  res.status(204).end()
})

export default router
