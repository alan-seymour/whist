import { describe, expect, it } from 'vitest'
import { createGame, gameReducer } from './reducer'
import {
  roundScores,
  runningTotals,
  scoreHand,
  standings,
  totals,
} from './scoring'
import type { Game } from './types'

describe('scoreHand', () => {
  it('scores 5 plus the bid when the bid is made exactly', () => {
    expect(scoreHand(0, 0)).toBe(5)
    expect(scoreHand(3, 3)).toBe(8)
    expect(scoreHand(7, 7)).toBe(12)
  })

  it('loses 5 plus the difference when the bid is missed', () => {
    expect(scoreHand(2, 3)).toBe(-6)
    expect(scoreHand(3, 0)).toBe(-8)
    expect(scoreHand(0, 1)).toBe(-6)
  })

  it('is null until both bid and tricks are entered', () => {
    expect(scoreHand(null, 2)).toBeNull()
    expect(scoreHand(2, null)).toBeNull()
    expect(scoreHand(null, null)).toBeNull()
  })
})

const play = (game: Game, round: number, bids: number[], tricks: number[]) =>
  bids.reduce(
    (g, _, player) =>
      gameReducer(
        gameReducer(g, { type: 'setBid', round, player, bid: bids[player] }),
        { type: 'setTricks', round, player, tricks: tricks[player] },
      ),
    game,
  )

describe('roundScores', () => {
  it('scores every player in the round', () => {
    const game = play(createGame(), 0, [2, 1, 3, 1], [2, 0, 3, 2])
    expect(roundScores(game.rounds[0])).toEqual([7, -6, 8, -6])
  })
})

describe('runningTotals', () => {
  it('accumulates round by round', () => {
    let game = play(createGame(), 0, [2, 1, 3, 1], [2, 0, 3, 2])
    game = play(game, 1, [1, 1, 2, 2], [1, 1, 2, 2])
    const running = runningTotals(game)
    expect(running[0]).toEqual([7, -6, 8, -6])
    expect(running[1]).toEqual([13, 0, 15, 1])
  })

  it('is null for a player once an earlier round is incomplete', () => {
    let game = createGame()
    game = gameReducer(game, { type: 'setBid', round: 0, player: 0, bid: 2 })
    game = gameReducer(game, {
      type: 'setTricks',
      round: 0,
      player: 0,
      tricks: 2,
    })
    game = play(game, 1, [1, 1, 1, 1], [1, 1, 1, 1])
    const running = runningTotals(game)
    expect(running[0]).toEqual([7, null, null, null])
    expect(running[1]).toEqual([13, null, null, null])
  })
})

describe('totals and standings', () => {
  it('sum completed hands and rank highest first, sharing ties', () => {
    let game = play(createGame(), 0, [2, 1, 3, 1], [2, 0, 3, 2])
    game = play(game, 1, [1, 1, 2, 2], [1, 1, 2, 1])
    expect(totals(game)).toEqual([13, 0, 15, -12])
    expect(standings(game)).toEqual([
      { player: 2, total: 15, rank: 1 },
      { player: 0, total: 13, rank: 2 },
      { player: 1, total: 0, rank: 3 },
      { player: 3, total: -12, rank: 4 },
    ])
  })

  it('shares a rank between tied players', () => {
    const game = play(createGame(), 0, [1, 1, 2, 0], [1, 1, 0, 0])
    expect(standings(game).map(s => [s.player, s.rank])).toEqual([
      [0, 1],
      [1, 1],
      [3, 3],
      [2, 4],
    ])
  })
})
