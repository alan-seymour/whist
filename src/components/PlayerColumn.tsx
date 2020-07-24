import React, { useState } from 'react'
import { PlayerRound } from './PlayerRound'
import { PlayerName, PlayerTotal } from './PlayerColumn.styles'
import ContentEditable from 'react-contenteditable'

interface Props {
  playerIndex: number
}

export const PlayerColumn = (props: Props) => {
  const [playerName, updatePlayerName] = useState('')
  const [roundScores, updateRoundScores] = useState<(number | null)[]>(
    Array(13).fill(null),
  )
  let rows = []
  let runningScore: number | null = 0
  for (let i = 0; i < 13; i++) {
    rows.push(
      <PlayerRound
        playerIndex={props.playerIndex}
        roundNumber={i}
        runningScore={runningScore}
        onScoreChange={score => {
          updateRoundScores([
            ...roundScores.slice(0, i),
            score,
            ...roundScores.slice(i + 1),
          ])
        }}
      />,
    )
    runningScore =
      runningScore !== null && roundScores[i] !== null
        ? runningScore + roundScores[i]!
        : null
  }

  return (
    <>
      <PlayerName playerIndex={props.playerIndex}>
        <ContentEditable
          html={playerName}
          onChange={event => updatePlayerName(event.target.value)}
        />
      </PlayerName>
      {rows}
      <PlayerTotal playerIndex={props.playerIndex}>{runningScore}</PlayerTotal>
    </>
  )
}
