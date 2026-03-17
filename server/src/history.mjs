import fs from 'node:fs'
import path from 'node:path'

export const DATA_DIR     = process.env.DATA_DIR ?? path.resolve('./data')
export const HISTORY_FILE = path.join(DATA_DIR, 'history.json')
export const MAX_HISTORY  = 50

export function loadHistory() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true })
    return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'))
  } catch {
    return []
  }
}

export function saveHistory(history) {
  try { fs.writeFileSync(HISTORY_FILE, JSON.stringify(history), 'utf8') }
  catch (err) { console.error('[history] save failed:', err.message) }
}
