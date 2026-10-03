import type { Dispatch } from 'react'
import { PlayerRowStyled } from './PlayerRow.styles'
import { PlayerRound } from './PlayerRound'
import type { GameAction, Round } from '../game'

interface Props {
  player: number
  rounds: Round[]
  running: (number | null)[]
  dispatch: Dispatch<GameAction>
}

export const PlayerRow = ({ player, rounds, running, dispatch }: Props) => (
  <PlayerRowStyled>
    {rounds.map((round, idx) => (
      <PlayerRound
        key={idx}
        bid={round.bids[player]}
        tricks={round.tricks[player]}
        runningScore={running[idx]}
        onBidChange={bid =>
          dispatch({ type: 'setBid', round: idx, player, bid })
        }
        onTricksChange={tricks =>
          dispatch({ type: 'setTricks', round: idx, player, tricks })
        }
      />
    ))}
  </PlayerRowStyled>
)
