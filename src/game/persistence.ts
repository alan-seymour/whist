import { ROUND_COUNT } from './rounds'
import { MAX_PLAYERS, MIN_PLAYERS, type Game } from './types'

export const STORAGE_KEY = 'whist.game'
const VERSION = 1

interface Stored {
  version: number
  game: Game
}

const isCount = (value: unknown): value is (number | null)[] =>
  Array.isArray(value) &&
  value.every(v => v === null || (typeof v === 'number' && Number.isFinite(v)))

const isGame = (value: unknown): value is Game => {
  if (typeof value !== 'object' || value === null) return false
  const game = value as Partial<Game>
  if (!Array.isArray(game.players) || !Array.isArray(game.rounds)) return false
  const count = game.players.length
  if (count < MIN_PLAYERS || count > MAX_PLAYERS) return false
  if (game.rounds.length !== ROUND_COUNT) return false
  if (typeof game.currentRound !== 'number') return false
  return (
    game.players.every(
      p => typeof p?.id === 'string' && typeof p?.name === 'string',
    ) &&
    game.rounds.every(
      r =>
        typeof r?.cards === 'number' &&
        isCount(r.bids) &&
        isCount(r.tricks) &&
        r.bids.length === count &&
        r.tricks.length === count,
    )
  )
}

export const loadGame = (storage: Storage = localStorage): Game | null => {
  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (!raw) return null
    const stored = JSON.parse(raw) as Partial<Stored>
    if (stored.version !== VERSION || !isGame(stored.game)) return null
    return stored.game
  } catch {
    return null
  }
}

export const saveGame = (game: Game, storage: Storage = localStorage) => {
  try {
    const stored: Stored = { version: VERSION, game }
    storage.setItem(STORAGE_KEY, JSON.stringify(stored))
  } catch {
    // Storage may be full or unavailable (private mode); the game still works.
  }
}

export const clearGame = (storage: Storage = localStorage) => {
  try {
    storage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

/** True if any bid or trick count has been entered. */
export const hasProgress = (game: Game): boolean =>
  game.rounds.some(
    round =>
      round.bids.some(bid => bid !== null) ||
      round.tricks.some(tricks => tricks !== null),
  )
