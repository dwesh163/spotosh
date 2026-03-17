import { MpvController } from './mpv.mjs'
import { saveHistory, MAX_HISTORY } from './history.mjs'
import { state, broadcast } from './state.mjs'

/**
 * Options yt-dlp passées à mpv pour éviter les pubs et segments sponsorisés.
 * - sponsorblock-remove : supprime automatiquement les segments via SponsorBlock
 *   (sponsor, intro, selfpromo, interaction, preview, music_offtopic)
 * - no-playlist : évite de charger une playlist entière si l'URL en est une
 */
const YTDL_OPTIONS = [
  '--ytdl-format=bestaudio/best',
  '--ytdl-raw-options-append=sponsorblock-remove=sponsor,intro,selfpromo,interaction,preview,music_offtopic',
  '--ytdl-raw-options-append=no-playlist=',
]

export function stopCurrent() {
  if (state.progressInterval) {
    clearInterval(state.progressInterval)
    state.progressInterval = null
  }
  if (state.mpv) {
    state.mpv.stop()
    state.mpv = null
  }
}

export function startProgressTimer(offsetMs = 0) {
  const t0 = Date.now()
  state.progressInterval = setInterval(async () => {
    if (state.mpv?.connected) {
      const pos = await state.mpv.getPosition()
      if (pos != null) {
        state.progressMs = Math.round(pos * 1000)
        broadcast()
        return
      }
    }
    // Fallback : estimation par timer si IPC pas disponible
    state.progressMs = offsetMs + (Date.now() - t0)
    broadcast()
  }, 500)
}

export function playItem(item, fromBack = false) {
  if (!fromBack && state.nowPlaying) {
    state.playedStack.push({ ...state.nowPlaying })
    if (state.playedStack.length > 30) state.playedStack.shift()
  }

  stopCurrent()
  state.nowPlaying = item
  state.isPlaying  = true
  state.progressMs = 0
  state.queue      = state.queue.filter(i => i.id !== item.id)

  state.history = [{ ...item, playedAt: Date.now() }, ...state.history].slice(0, MAX_HISTORY)
  saveHistory(state.history)

  broadcast()

  const searchQuery = `${item.artist} ${item.title}`
  console.log(`▶  Playing: ${searchQuery}`)

  state.mpv = new MpvController()

  state.mpv.on('error', err => {
    console.error('[playback error]', err.message)
    setTimeout(advanceQueue, 1500)
  })

  state.mpv.on('ended', code => {
    console.log(`[playback] ended (code ${code})`)
    advanceQueue()
  })

  state.mpv.spawn([
    `--volume=${state.volume}`,
    ...YTDL_OPTIONS,
    `ytdl://ytsearch1:${searchQuery}`,
  ])

  startProgressTimer(0)
}

export function advanceQueue() {
  stopCurrent()
  if (state.queue.length > 0) {
    playItem(state.queue[0])
  } else {
    state.nowPlaying = null
    state.isPlaying  = false
    state.progressMs = 0
    broadcast()
  }
}
