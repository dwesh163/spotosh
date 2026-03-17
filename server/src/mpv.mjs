import { spawn } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { EventEmitter } from 'node:events'
import net from 'node:net'
import os from 'node:os'
import path from 'node:path'
import fs from 'node:fs'

/**
 * Contrôle mpv via socket IPC JSON (--input-ipc-server).
 * Émet : 'ended' (fin naturelle), 'error' (erreur process/spawn)
 */
export class MpvController extends EventEmitter {
    constructor() {
        super()
        this.process = null
        this.socket = null
        this.socketPath = null
        this.connected = false
        this.pending = new Map()  // request_id → { resolve, reject }
        this._reqId = 0
        this._buf = ''
        this.intentionalStop = false
    }

    spawn(args) {
        this.intentionalStop = false
        this.socketPath = path.join(os.tmpdir(), `mpv-${randomUUID()}.sock`)

        this.process = spawn('mpv', [
            '--no-video',
            '--really-quiet',
            '--ao=pulse',
            `--input-ipc-server=${this.socketPath}`,
            ...args,
        ])

        this.process.stderr.on('data', chunk => {
            const msg = chunk.toString().trim()
            if (msg) console.error('[mpv]', msg)
        })

        this.process.on('error', err => {
            console.error('[mpv spawn]', err.message)
            this.emit('error', err)
        })

        this.process.on('close', code => {
            console.log(`[mpv] exited (code ${code})`)
            this.connected = false
            this._destroySocket()
            this._cleanSocketFile()
            if (!this.intentionalStop) this.emit('ended', code)
        })

        this._connectWithRetry().catch(err =>
            console.warn('[mpv IPC] could not connect:', err.message)
        )
    }

    async _connectWithRetry(retries = 15, delayMs = 200) {
        for (let i = 0; i < retries; i++) {
            await new Promise(r => setTimeout(r, delayMs))
            if (this.intentionalStop) return
            try {
                await this._tryConnect()
                console.log('[mpv] IPC socket connected')
                return
            } catch { /* retry */ }
        }
        throw new Error('IPC socket unreachable after retries')
    }

    _tryConnect() {
        return new Promise((resolve, reject) => {
            const sock = net.createConnection(this.socketPath)
            sock.once('connect', () => {
                this.socket = sock
                this.connected = true
                sock.on('data', chunk => this._handleData(chunk.toString()))
                sock.on('error', err => { console.error('[mpv socket]', err.message); this.connected = false })
                sock.on('close', () => { this.connected = false })
                resolve()
            })
            sock.once('error', reject)
        })
    }

    _handleData(data) {
        this._buf += data
        const lines = this._buf.split('\n')
        this._buf = lines.pop()
        for (const line of lines) {
            if (!line.trim()) continue
            try {
                const msg = JSON.parse(line)
                if (msg.request_id != null && this.pending.has(msg.request_id)) {
                    const { resolve, reject } = this.pending.get(msg.request_id)
                    this.pending.delete(msg.request_id)
                    if (msg.error === 'success') resolve(msg.data)
                    else reject(new Error(msg.error ?? 'mpv error'))
                }
                if (msg.event) this.emit('mpv-event', msg)
            } catch { /* JSON invalide */ }
        }
    }

    command(cmd) {
        return new Promise((resolve, reject) => {
            if (!this.connected || !this.socket) {
                return reject(new Error('mpv IPC not connected'))
            }
            const id = ++this._reqId
            const t = setTimeout(() => {
                if (this.pending.has(id)) {
                    this.pending.delete(id)
                    reject(new Error('mpv command timeout'))
                }
            }, 3000)
            this.pending.set(id, {
                resolve: v => { clearTimeout(t); resolve(v) },
                reject: e => { clearTimeout(t); reject(e) },
            })
            this.socket.write(JSON.stringify({ command: cmd, request_id: id }) + '\n')
        })
    }

    setProperty(name, value) { return this.command(['set_property', name, value]) }
    getProperty(name) { return this.command(['get_property', name]) }

    async pause() { return this.setProperty('pause', true) }
    async resume() { return this.setProperty('pause', false) }
    async setVolume(vol) { return this.setProperty('volume', vol) }
    async seek(secs) { return this.command(['seek', secs, 'absolute']) }

    async getPosition() {
        try { return await this.getProperty('time-pos') }
        catch { return null }
    }

    stop() {
        this.intentionalStop = true
        this._destroySocket()
        if (this.process) { this.process.kill('SIGTERM'); this.process = null }
        this.connected = false
    }

    _destroySocket() {
        if (this.socket) { this.socket.destroy(); this.socket = null }
    }

    _cleanSocketFile() {
        if (this.socketPath) {
            try { fs.unlinkSync(this.socketPath) } catch { /* ignore */ }
            this.socketPath = null
        }
    }
}
