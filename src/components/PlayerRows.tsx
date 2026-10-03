import type { Dispatch } from 'react'
import { PlayerRow } from './PlayerRow'
import { runningTotals, type Game, type GameAction } from '../game'

interface Props {
  game: Game
  visibleRounds: number
  dispatch: Dispatch<GameAction>
}

export const PlayerRows = ({ game, visibleRounds, dispatch }: Props) => {
  const running = runningTotals(game)
  return (
    <>
      {game.players.map((player, idx) => (
        <PlayerRow
          key={player.id}
          player={idx}
          rounds={game.rounds.slice(0, visibleRounds)}
          running={running.slice(0, visibleRounds).map(r => r[idx])}
          dispatch={dispatch}
        />
      ))}
    </>
  )
}
