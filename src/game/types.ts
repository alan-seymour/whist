export interface Player {
  id: string
  name: string
}

export interface Round {
  cards: number
  /** One entry per player, in player order. `null` until entered. */
  bids: (number | null)[]
  /** One entry per player, in player order. `null` until entered. */
  tricks: (number | null)[]
}

export type GameStatus = 'setup' | 'playing' | 'finished'

export interface Game {
  status: GameStatus
  players: Player[]
  rounds: Round[]
  /** Index into `rounds` of the round currently being played. */
  currentRound: number
}

export const MIN_PLAYERS = 2
export const MAX_PLAYERS = 7
