import { describe, expect, it } from 'vitest'
import { createGame, gameReducer } from './reducer'

describe('gameReducer', () => {
  it('starts with four players and thirteen empty rounds', () => {
    const game = createGame()
    expect(game.players.map(p => p.name)).toEqual([
      'Player 1',
      'Player 2',
      'Player 3',
      'Player 4',
    ])
    expect(game.rounds).toHaveLength(13)
    expect(game.currentRound).toBe(0)
  })

  it('adds players up to seven', () => {
    let game = createGame()
    for (let i = 0; i < 5; i++) game = gameReducer(game, { type: 'addPlayer' })
    expect(game.players).toHaveLength(7)
    expect(game.players[6].name).toBe('Player 7')
    expect(game.rounds[0].bids).toHaveLength(7)
    expect(game.rounds[12].tricks).toHaveLength(7)
  })

  it('removes a player and their entries, keeping at least two', () => {
    let game = createGame()
    game = gameReducer(game, { type: 'setBid', round: 0, player: 1, bid: 2 })
    game = gameReducer(game, { type: 'setBid', round: 0, player: 2, bid: 3 })
    game = gameReducer(game, { type: 'removePlayer', player: 1 })
    expect(game.players.map(p => p.name)).toEqual([
      'Player 1',
      'Player 3',
      'Player 4',
    ])
    expect(game.rounds[0].bids).toEqual([null, 3, null])
    game = gameReducer(game, { type: 'removePlayer', player: 0 })
    expect(gameReducer(game, { type: 'removePlayer', player: 0 })).toBe(game)
  })

  it('renames a player', () => {
    const game = gameReducer(createGame(), {
      type: 'renamePlayer',
      player: 2,
      name: 'Alice',
    })
    expect(game.players[2].name).toBe('Alice')
  })

  it('moves a player along with their entries', () => {
    let game = createGame()
    game = gameReducer(game, { type: 'setBid', round: 0, player: 3, bid: 1 })
    game = gameReducer(game, {
      type: 'setTricks',
      round: 5,
      player: 3,
      tricks: 0,
    })
    game = gameReducer(game, { type: 'movePlayer', from: 3, to: 0 })
    expect(game.players.map(p => p.name)).toEqual([
      'Player 4',
      'Player 1',
      'Player 2',
      'Player 3',
    ])
    expect(game.rounds[0].bids).toEqual([1, null, null, null])
    expect(game.rounds[5].tricks).toEqual([0, null, null, null])
  })

  it('records bids and tricks and allows clearing them', () => {
    let game = createGame()
    game = gameReducer(game, { type: 'setBid', round: 2, player: 0, bid: 4 })
    game = gameReducer(game, {
      type: 'setTricks',
      round: 2,
      player: 0,
      tricks: 4,
    })
    expect(game.rounds[2].bids[0]).toBe(4)
    expect(game.rounds[2].tricks[0]).toBe(4)
    game = gameReducer(game, { type: 'setBid', round: 2, player: 0, bid: null })
    expect(game.rounds[2].bids[0]).toBeNull()
  })

  it('ignores entries for players or rounds that do not exist', () => {
    const game = createGame()
    expect(
      gameReducer(game, { type: 'setBid', round: 13, player: 0, bid: 1 }),
    ).toBe(game)
    expect(
      gameReducer(game, { type: 'setTricks', round: 0, player: 4, tricks: 1 }),
    ).toBe(game)
  })

  it('moves between rounds within the schedule', () => {
    let game = createGame()
    game = gameReducer(game, { type: 'completeRound' })
    expect(game.currentRound).toBe(1)
    game = gameReducer(game, { type: 'goToRound', round: 40 })
    expect(game.currentRound).toBe(12)
    expect(gameReducer(game, { type: 'completeRound' }).currentRound).toBe(12)
    game = gameReducer(game, { type: 'goToRound', round: -3 })
    expect(game.currentRound).toBe(0)
  })

  it('starts a new game, optionally keeping the players', () => {
    let game = gameReducer(createGame(), {
      type: 'renamePlayer',
      player: 0,
      name: 'Alice',
    })
    game = gameReducer(game, { type: 'setBid', round: 0, player: 0, bid: 1 })
    const again = gameReducer(game, { type: 'newGame', players: game.players })
    expect(again.players[0].name).toBe('Alice')
    expect(again.rounds[0].bids).toEqual([null, null, null, null])
    const fresh = gameReducer(game, { type: 'newGame' })
    expect(fresh.players[0].name).toBe('Player 1')
  })
})
