import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearGame,
  hasProgress,
  loadGame,
  saveGame,
  STORAGE_KEY,
} from './persistence'
import { createGame, gameReducer } from './reducer'

describe('persistence', () => {
  beforeEach(() => localStorage.clear())

  it('round-trips a game', () => {
    const game = gameReducer(createGame(), {
      type: 'setBid',
      round: 0,
      player: 0,
      bid: 2,
    })
    saveGame(game)
    expect(loadGame()).toEqual(game)
  })

  it('returns null when nothing is saved', () => {
    expect(loadGame()).toBeNull()
  })

  it('rejects unparseable, outdated or malformed data', () => {
    localStorage.setItem(STORAGE_KEY, 'not json')
    expect(loadGame()).toBeNull()
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 0, game: createGame() }),
    )
    expect(loadGame()).toBeNull()
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, game: { ...createGame(), rounds: [] } }),
    )
    expect(loadGame()).toBeNull()
  })

  it('clears a saved game', () => {
    saveGame(createGame())
    clearGame()
    expect(loadGame()).toBeNull()
  })

  it('knows whether anything has been entered', () => {
    const game = createGame()
    expect(hasProgress(game)).toBe(false)
    expect(
      hasProgress(
        gameReducer(game, {
          type: 'setTricks',
          round: 3,
          player: 1,
          tricks: 0,
        }),
      ),
    ).toBe(true)
  })
})
