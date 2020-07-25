import React, { useState, useMemo } from 'react'
import { PlayerRowStyled } from './PlayerRow.styles'
import { PlayerRound } from './PlayerRound'

interface Props {
  visibleRounds: number
}

export const PlayerRow = (props: Props) => {
  const [roundScores, updateRoundScores] = useState(Array(13).fill(null))
  const rounds = useMemo(() => {
    const rounds = []
    let runningTotal: number | null = 0
    for (let i = 0; i < props.visibleRounds; i++) {
      rounds.push(
        <PlayerRound
          key={i}
          runningScore={runningTotal}
          onScoreChange={score =>
            updateRoundScores([
              ...roundScores.slice(0, i),
              score,
              ...roundScores.slice(i + 1),
            ])
          }
        />,
      )
      runningTotal =
        runningTotal !== null && roundScores[i] !== null
          ? runningTotal + roundScores[i]
          : null
    }
    return rounds
  }, [props.visibleRounds, roundScores])

  return <PlayerRowStyled>{rounds}</PlayerRowStyled>
}
