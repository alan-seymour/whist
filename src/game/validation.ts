import type { Round } from './types'

export type RoundIssue =
  | { kind: 'bid-out-of-range'; player: number }
  | { kind: 'tricks-out-of-range'; player: number }
  | { kind: 'tricks-total'; total: number; cards: number }

const inRange = (value: number | null, cards: number) =>
  value === null || (Number.isInteger(value) && value >= 0 && value <= cards)

/**
 * Problems with a round's entries. Issues are advisory: entry is never
 * blocked, the UI just highlights them.
 */
export const roundIssues = (round: Round): RoundIssue[] => {
  const issues: RoundIssue[] = []
  round.bids.forEach((bid, player) => {
    if (!inRange(bid, round.cards))
      issues.push({ kind: 'bid-out-of-range', player })
  })
  round.tricks.forEach((tricks, player) => {
    if (!inRange(tricks, round.cards))
      issues.push({ kind: 'tricks-out-of-range', player })
  })
  if (round.tricks.every(tricks => tricks !== null)) {
    const total = round.tricks.reduce<number>((sum, t) => sum + (t ?? 0), 0)
    if (total !== round.cards)
      issues.push({ kind: 'tricks-total', total, cards: round.cards })
  }
  return issues
}

export const isRoundComplete = (round: Round): boolean =>
  round.bids.every(bid => bid !== null) &&
  round.tricks.every(tricks => tricks !== null)
