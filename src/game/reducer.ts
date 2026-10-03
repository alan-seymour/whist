import { createRounds, ROUND_COUNT } from './rounds'
import { MAX_PLAYERS, MIN_PLAYERS, type Game, type Player } from './types'

export type GameAction =
  | { type: 'addPlayer' }
  | { type: 'removePlayer'; player: number }
  | { type: 'renamePlayer'; player: number; name: string }
  | { type: 'movePlayer'; from: number; to: number }
  | { type: 'setBid'; round: number; player: number; bid: number | null }
  | { type: 'setTricks'; round: number; player: number; tricks: number | null }
  | { type: 'completeRound' }
  | { type: 'goToRound'; round: number }
  | { type: 'newGame'; players?: Player[] }

let nextId = 0
export const createPlayer = (name: string): Player => ({
  id: `p${Date.now().toString(36)}${(nextId++).toString(36)}`,
  name,
})

export const createGame = (players?: Player[]): Game => {
  const initial =
    players ??
    Array.from({ length: 4 }, (_, idx) => createPlayer(`Player ${idx + 1}`))
  return {
    players: initial,
    rounds: createRounds(initial.length),
    currentRound: 0,
  }
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

const updateList = <T>(list: T[], index: number, value: T): T[] =>
  list.map((item, idx) => (idx === index ? value : item))

const moveItem = <T>(list: T[], from: number, to: number): T[] => {
  const result = [...list]
  const [item] = result.splice(from, 1)
  result.splice(to, 0, item)
  return result
}

/** Apply a per-player array change to every round. */
const mapRounds = (game: Game, transform: <T>(list: T[]) => T[]): Game => ({
  ...game,
  rounds: game.rounds.map(round => ({
    ...round,
    bids: transform(round.bids),
    tricks: transform(round.tricks),
  })),
})

export const gameReducer = (game: Game, action: GameAction): Game => {
  switch (action.type) {
    case 'addPlayer': {
      if (game.players.length >= MAX_PLAYERS) return game
      const player = createPlayer(`Player ${game.players.length + 1}`)
      return {
        ...mapRounds(game, list => [...list, null as never]),
        players: [...game.players, player],
      }
    }
    case 'removePlayer': {
      if (game.players.length <= MIN_PLAYERS) return game
      if (action.player < 0 || action.player >= game.players.length) return game
      return {
        ...mapRounds(game, list =>
          list.filter((_, idx) => idx !== action.player),
        ),
        players: game.players.filter((_, idx) => idx !== action.player),
      }
    }
    case 'renamePlayer': {
      const player = game.players[action.player]
      if (!player) return game
      return {
        ...game,
        players: updateList(game.players, action.player, {
          ...player,
          name: action.name,
        }),
      }
    }
    case 'movePlayer': {
      const { from, to } = action
      const count = game.players.length
      if (from === to || from < 0 || to < 0 || from >= count || to >= count)
        return game
      return {
        ...mapRounds(game, list => moveItem(list, from, to)),
        players: moveItem(game.players, from, to),
      }
    }
    case 'setBid': {
      const round = game.rounds[action.round]
      if (!round || action.player >= game.players.length) return game
      return {
        ...game,
        rounds: updateList(game.rounds, action.round, {
          ...round,
          bids: updateList(round.bids, action.player, action.bid),
        }),
      }
    }
    case 'setTricks': {
      const round = game.rounds[action.round]
      if (!round || action.player >= game.players.length) return game
      return {
        ...game,
        rounds: updateList(game.rounds, action.round, {
          ...round,
          tricks: updateList(round.tricks, action.player, action.tricks),
        }),
      }
    }
    case 'completeRound':
      return {
        ...game,
        currentRound: clamp(game.currentRound + 1, 0, ROUND_COUNT - 1),
      }
    case 'goToRound':
      return { ...game, currentRound: clamp(action.round, 0, ROUND_COUNT - 1) }
    case 'newGame':
      return createGame(action.players)
  }
}
