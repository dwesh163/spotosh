import { EventEmitter } from 'node:events'
import { loadHistory } from './history.mjs'

/**
 * État global de l'application.
 * Toutes les mutations doivent passer par ce module pour garantir la cohérence.
 */
export const state = {
  queue:            [],
  nowPlaying:       null,
  isPlaying:        false,
  progressMs:       0,
  volume:           80,       // 0–100
  userCount:        0,
  history:          loadHistory(),  // { ...QueueItem, playedAt } newest first
  playedStack:      [],             // navigation arrière (max 30)
  mpv:              null,           // MpvController actif
  progressInterval: null,
}

export const emitter = new EventEmitter()
emitter.setMaxListeners(200)

export function getState() {
  return {
    queue:      [...state.queue],
    nowPlaying: state.nowPlaying,
    isPlaying:  state.isPlaying,
    progressMs: state.progressMs,
    volume:     state.volume,
    connected:  state.mpv?.connected ?? false,
    userCount:  state.userCount,
    canGoBack:  state.playedStack.length > 1,
  }
}

export function broadcast() {
  emitter.emit('state', getState())
}
