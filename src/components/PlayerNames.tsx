import React, { useState, useEffect } from 'react'

interface Props {
  playerCount: number
}

export const PlayerNames = ({ playerCount }: Props) => {
  const [playerNames, updatePlayerNames] = useState<string[]>([])
  useEffect(() => {
    if (playerCount > playerNames.length) {
      updatePlayerNames([...playerNames, `Player ${playerNames.length + 1}`])
    } else if (playerCount < playerNames.length) {
      updatePlayerNames(playerNames.slice(0, -1))
    }
  }, [playerCount, playerNames])
  return (
    <div>
      {playerNames.map((name, idx) => {
        return (
          <div
            key={idx}
            contentEditable
            onChange={(event: any) =>
              updatePlayerNames([
                ...playerNames.slice(0, idx),
                event.target.value,
                ...playerNames.slice(idx),
              ])
            }
          >
            {name}
          </div>
        )
      })}
    </div>
  )
}
