import { Router } from 'express'
import { getState } from '../state.mjs'

const router = Router()

router.get('/', (_req, res) => res.json(getState()))

export default router
