import React, { useState } from 'react'
import { PlayerNames } from './PlayerNames'
import { PadGrid, RoundNumber } from './Scorepad.styles'
import { PlayerColumn } from './PlayerColumn'

const rounds = [7, 6, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6, 7]

export const Scorepad = () => {
  const [playerCount, updatePlayerCount] = useState(4)
  const PlayerCols = []
  for (let i = 0; i < playerCount; i++) {
    PlayerCols.push(<PlayerColumn playerIndex={i} />)
  }
  return (
    <>
      <PadGrid playerCount={playerCount}>
        {rounds.map((round, idx) => (
          <RoundNumber roundNumber={idx}>{round}</RoundNumber>
        ))}
        {PlayerCols}
      </PadGrid>
      <div>
        <button onClick={() => updatePlayerCount(playerCount + 1)}>
          Add Player
        </button>
        <button onClick={() => updatePlayerCount(Math.max(playerCount - 1, 0))}>
          Remove Player
        </button>
      </div>
    </>
  )
}
