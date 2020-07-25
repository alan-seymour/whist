import React, { useState, useEffect } from 'react'
import { SideBar, Name, AddPlayer } from './PlayerNames.styles'
import ContentEditable from 'react-contenteditable'
import { FiPlusCircle } from 'react-icons/fi'

interface Props {
  playerCount: number
  updatePlayerCount: (count: number) => void
}

export const PlayerNames = ({ playerCount, updatePlayerCount }: Props) => {
  const [playerNames, updatePlayerNames] = useState<string[]>([])
  useEffect(() => {
    if (playerCount > playerNames.length) {
      updatePlayerNames([...playerNames, `Player ${playerNames.length + 1}`])
    } else if (playerCount < playerNames.length) {
      updatePlayerNames(playerNames.slice(0, -1))
    }
  }, [playerCount, playerNames])
  return (
    <SideBar>
      {playerNames.map((name, idx) => (
        <Name key={idx}>
          <ContentEditable
            html={name}
            onChange={event => {
              updatePlayerNames([
                ...playerNames.slice(0, idx),
                event.target.value,
                ...playerNames.slice(idx + 1),
              ])
            }}
          />
        </Name>
      ))}
      {playerCount < 7 && (
        <AddPlayer onClick={() => updatePlayerCount(playerCount + 1)}>
          <FiPlusCircle />
          Add Player
        </AddPlayer>
      )}
    </SideBar>
  )
}
