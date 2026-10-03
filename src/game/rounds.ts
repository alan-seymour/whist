import type { Round } from './types'

/** Knock-out whist: 7 cards down to 1 and back up to 7. */
export const ROUND_CARDS = [7, 6, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6, 7] as const

export const ROUND_COUNT = ROUND_CARDS.length

export const createRounds = (playerCount: number): Round[] =>
  ROUND_CARDS.map(cards => ({
    cards,
    bids: Array<number | null>(playerCount).fill(null),
    tricks: Array<number | null>(playerCount).fill(null),
  }))
