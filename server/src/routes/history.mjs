import { Router } from 'express'
import { state } from '../state.mjs'
import { saveHistory } from '../history.mjs'

const router = Router()

router.get('/', (_req, res) => res.json(state.history))

router.delete('/:id', (req, res) => {
  const before = state.history.length
  state.history = state.history.filter(item => item.id !== req.params.id)
  if (state.history.length === before) return res.status(404).json({ error: 'Not found' })
  saveHistory(state.history)
  res.json({ ok: true })
})

export default router
