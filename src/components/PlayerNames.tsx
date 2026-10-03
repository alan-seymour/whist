import { useState } from 'react'
import { SideBar, Name, AddPlayer } from './PlayerNames.styles'
import { FiPlusCircle } from 'react-icons/fi'

interface Props {
  playerCount: number
  updatePlayerCount: (count: number) => void
}

export const PlayerNames = ({ playerCount, updatePlayerCount }: Props) => {
  const [customNames, updateCustomNames] = useState<Record<number, string>>({})
  const playerNames = Array.from(
    { length: playerCount },
    (_, idx) => customNames[idx] ?? `Player ${idx + 1}`,
  )
  return (
    <SideBar>
      {playerNames.map((name, idx) => (
        <Name key={idx}>
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={event => {
              updateCustomNames({
                ...customNames,
                [idx]: event.currentTarget.textContent ?? '',
              })
            }}
          >
            {name}
          </div>
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
