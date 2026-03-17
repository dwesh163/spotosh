import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { MpvController } from './mpv.mjs'
import { saveHistory, MAX_HISTORY } from './history.mjs'
import { state, broadcast } from './state.mjs'

const execFileAsync = promisify(execFile)

/**
 * yt-dlp options forwarded to mpv to skip ads and sponsored segments.
 * - sponsorblock-remove: automatically cuts SponsorBlock-marked segments
 *   (sponsor, intro, selfpromo, interaction, preview, music_offtopic)
 * - no-playlist: prevents loading an entire playlist when a playlist URL is matched
 */
const YTDL_OPTIONS = [
    '--ytdl-format=bestaudio/best',
    '--ytdl-raw-options-append=sponsorblock-remove=sponsor,intro,selfpromo,interaction,preview,music_offtopic',
    '--ytdl-raw-options-append=no-playlist=',
    // Tell yt-dlp to use Node.js for executing JS (required for some YouTube signatures)
    '--ytdl-raw-options-append=js-runtimes=node',
]

/**
 * Resolves the stream URL for a given track using yt-dlp directly.
 * This is used for preloading the next track to hide latency.
 */
async function resolveStreamUrl(query) {
    try {
        const { stdout } = await execFileAsync('yt-dlp', [
            '-g',
            '--format=bestaudio/best',
            '--no-playlist',
            '--js-runtimes=node',
            `ytsearch1:${query}`
        ], { timeout: 15000 })
        return stdout.trim().split('\n')[0]
    } catch (e) {
        console.warn(`[preload] failed to resolve "${query}":`, e.message)
        return null
    }
}

async function preloadNext() {
    const nextItem = state.queue[0]
    if (!nextItem || nextItem.resolvedUrl || nextItem.isResolving) return

    nextItem.isResolving = true
    const query = `${nextItem.artist} ${nextItem.title}`
    console.log(`[preload] Resolving next: ${query}`)

    const url = await resolveStreamUrl(query)
    if (url) {
        nextItem.resolvedUrl = url
        nextItem.resolvedAt = Date.now()
        console.log(`[preload] Ready: ${nextItem.title}`)
    }
    nextItem.isResolving = false
}

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
    // const t0 = Date.now()
    state.progressInterval = setInterval(async () => {
        if (state.mpv?.connected) {
            const pos = await state.mpv.getPosition()
            if (pos != null) {
                state.progressMs = Math.round(pos * 1000)
                broadcast()
                return
            }
        }
    }, 500)
}

export function playItem(item, fromBack = false) {
    if (!fromBack && state.nowPlaying) {
        state.playedStack.push({ ...state.nowPlaying })
        if (state.playedStack.length > 30) state.playedStack.shift()
    }

    stopCurrent()
    state.nowPlaying = item
    state.isPlaying = true
    state.progressMs = 0
    state.queue = state.queue.filter(i => i.id !== item.id)

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

    // Determine if we use preloaded URL or let mpv resolve it
    let mediaArg
    let mpvArgs = [
        `--volume=${state.volume}`,
        `--force-media-title=${item.artist} - ${item.title}`,
    ]

    const isPreloaded = item.resolvedUrl && (Date.now() - (item.resolvedAt || 0) < 3600000) // 1h expiry

    if (isPreloaded) {
        console.log(`[playback] Using preloaded URL for ${item.title}`)
        mediaArg = item.resolvedUrl
        // Even if preloaded, we pass YTDL options just in case, though they likely won't apply to a raw URL
        mpvArgs.push(...YTDL_OPTIONS)
    } else {
        mediaArg = `ytdl://ytsearch1:${searchQuery}`
        mpvArgs.push(...YTDL_OPTIONS)
    }

    state.mpv.spawn([...mpvArgs, mediaArg])

    startProgressTimer(0)

    // Trigger preload for the NEXT track
    preloadNext().catch(err => console.error('[preload] error trigger', err))
}

export function advanceQueue() {
    stopCurrent()
    if (state.queue.length > 0) {
        playItem(state.queue[0])
    } else {
        state.nowPlaying = null
        state.isPlaying = false
        state.progressMs = 0
        broadcast()
    }
}
