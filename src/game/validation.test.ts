import { describe, expect, it } from 'vitest'
import { isRoundComplete, roundIssues } from './validation'
import type { Round } from './types'

const round = (
  bids: (number | null)[],
  tricks: (number | null)[],
  cards = 3,
): Round => ({
  cards,
  bids,
  tricks,
})

describe('roundIssues', () => {
  it('accepts a valid complete round', () => {
    expect(roundIssues(round([1, 2, 0], [1, 1, 1]))).toEqual([])
  })

  it('accepts a partially entered round', () => {
    expect(roundIssues(round([1, null, 0], [null, null, 1]))).toEqual([])
  })

  it('flags bids and tricks outside 0..cards', () => {
    expect(roundIssues(round([4, -1, 0], [1, 1, 5]))).toEqual([
      { kind: 'bid-out-of-range', player: 0 },
      { kind: 'bid-out-of-range', player: 1 },
      { kind: 'tricks-out-of-range', player: 2 },
      { kind: 'tricks-total', total: 7, cards: 3 },
    ])
  })

  it('flags tricks that do not add up to the cards dealt, once all are entered', () => {
    expect(roundIssues(round([1, 1, 1], [1, 1, 0]))).toEqual([
      { kind: 'tricks-total', total: 2, cards: 3 },
    ])
    expect(roundIssues(round([1, 1, 1], [1, 1, null]))).toEqual([])
  })

  it('does not flag bids that add up to the cards dealt', () => {
    expect(roundIssues(round([1, 1, 1], [1, 1, 1]))).toEqual([])
  })
})

describe('isRoundComplete', () => {
  it('needs every bid and trick count', () => {
    expect(isRoundComplete(round([1, 1, 1], [1, 1, 1]))).toBe(true)
    expect(isRoundComplete(round([1, 1, null], [1, 1, 1]))).toBe(false)
    expect(isRoundComplete(round([1, 1, 1], [1, null, 1]))).toBe(false)
  })
})
