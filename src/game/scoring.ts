import type { Game, Round } from './types'

/**
 * Score for one hand. Making the bid exactly scores 5 plus the bid; missing
 * it loses 5 plus the number of tricks over or under.
 */
export const scoreHand = (
  bid: number | null,
  tricks: number | null,
): number | null => {
  if (bid === null || tricks === null) return null
  return bid === tricks ? 5 + bid : -(5 + Math.abs(bid - tricks))
}

export const roundScores = (round: Round): (number | null)[] =>
  round.bids.map((bid, player) => scoreHand(bid, round.tricks[player]))

/**
 * Running total per round per player. A total is `null` once any earlier
 * round for that player is incomplete, so partial totals are never shown.
 */
export const runningTotals = (game: Game): (number | null)[][] => {
  const totals: (number | null)[][] = []
  let previous: (number | null)[] = game.players.map(() => 0)
  for (const round of game.rounds) {
    const scores = roundScores(round)
    const current = previous.map((total, player) => {
      const score = scores[player]
      return total === null || score === null ? null : total + score
    })
    totals.push(current)
    previous = current
  }
  return totals
}

/** Total of all completed hands per player, ignoring unentered rounds. */
export const totals = (game: Game): number[] =>
  game.players.map((_, player) =>
    game.rounds.reduce(
      (sum, round) => sum + (roundScores(round)[player] ?? 0),
      0,
    ),
  )

export interface Standing {
  player: number
  total: number
  rank: number
}

/** Players ordered by total, highest first. Ties share a rank. */
export const standings = (game: Game): Standing[] => {
  const sorted = totals(game)
    .map((total, player) => ({ player, total }))
    .sort((a, b) => b.total - a.total)
  let rank = 0
  return sorted.map((entry, idx) => {
    if (idx === 0 || entry.total !== sorted[idx - 1].total) rank = idx + 1
    return { ...entry, rank }
  })
}
