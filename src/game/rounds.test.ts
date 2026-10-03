import { describe, expect, it } from 'vitest'
import { createRounds, ROUND_CARDS, ROUND_COUNT } from './rounds'

describe('rounds', () => {
  it('runs from 7 cards down to 1 and back up to 7', () => {
    expect(ROUND_CARDS).toEqual([7, 6, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6, 7])
    expect(ROUND_COUNT).toBe(13)
  })

  it('creates empty bid and trick slots for every player', () => {
    const rounds = createRounds(3)
    expect(rounds).toHaveLength(13)
    expect(rounds[0]).toEqual({
      cards: 7,
      bids: [null, null, null],
      tricks: [null, null, null],
    })
    expect(rounds[6].cards).toBe(1)
  })
})
