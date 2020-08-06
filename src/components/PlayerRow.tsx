import React, { useState, useMemo, useCallback } from 'react'
import { PlayerRowStyled } from './PlayerRow.styles'
import { PlayerRound } from './PlayerRound'

interface Props {
  visibleRounds: number
}

// const rounds = [1,2,3,4,5,6,7,8,9,10,11,12,13]

export const PlayerRow = (props: Props) => {
  const [roundScores, updateRoundScores] = useState<(number | null)[]>(
    Array(13).fill(null),
  )
  const callback = useCallback(
    (score, index) =>
      updateRoundScores([
        ...roundScores.slice(0, index),
        score,
        ...roundScores.slice(index + 1),
      ]),
    [roundScores, updateRoundScores],
  )
  const rounds = useMemo(() => {
    const rounds = []
    let runningTotal: number | null = 0
    for (let i = 0; i < 13; i++) {
      const roundScore = roundScores[i]
      runningTotal =
        runningTotal !== null && roundScore !== null
          ? runningTotal + roundScore
          : null
      rounds.push(
        <PlayerRound
          key={i}
          runningScore={runningTotal}
          onScoreChange={score => callback(score, i)}
          score={roundScores[i]}
        />,
      )
    }
    return rounds
  }, [roundScores, callback])

  return (
    <PlayerRowStyled>{rounds.slice(0, props.visibleRounds)}</PlayerRowStyled>
  )
}
