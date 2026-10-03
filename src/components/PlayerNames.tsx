import type { Dispatch } from 'react'
import { SideBar, Name, AddPlayer } from './PlayerNames.styles'
import { FiMinusCircle, FiPlusCircle } from 'react-icons/fi'
import { MAX_PLAYERS, MIN_PLAYERS, type GameAction, type Player } from '../game'

interface Props {
  players: Player[]
  dispatch: Dispatch<GameAction>
}

export const PlayerNames = ({ players, dispatch }: Props) => (
  <SideBar>
    {players.map((player, idx) => (
      <Name key={player.id}>
        <div
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-label={`Player ${idx + 1} name`}
          onBlur={event =>
            dispatch({
              type: 'renamePlayer',
              player: idx,
              name: event.currentTarget.textContent?.trim() || player.name,
            })
          }
        >
          {player.name}
        </div>
      </Name>
    ))}
    {players.length < MAX_PLAYERS && (
      <AddPlayer type="button" onClick={() => dispatch({ type: 'addPlayer' })}>
        <FiPlusCircle />
        Add Player
      </AddPlayer>
    )}
    {players.length > MIN_PLAYERS && (
      <AddPlayer
        type="button"
        onClick={() =>
          dispatch({ type: 'removePlayer', player: players.length - 1 })
        }
      >
        <FiMinusCircle />
        Remove Player
      </AddPlayer>
    )}
  </SideBar>
)
