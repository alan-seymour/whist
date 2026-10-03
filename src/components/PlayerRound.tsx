import {
  PlayerRoundStyled,
  PlayerRaw,
  PlayerBid,
  PlayerGot,
  PlayerTotal,
  UnstyledInput,
} from './PlayerRound.styles'

interface Props {
  bid: number | null
  tricks: number | null
  runningScore: number | null
  onBidChange: (bid: number | null) => void
  onTricksChange: (tricks: number | null) => void
}

const parseInput = (input: string): number | null => {
  const parsed = parseInt(input, 10)
  return Number.isNaN(parsed) ? null : parsed
}

export const PlayerRound = ({
  bid,
  tricks,
  runningScore,
  onBidChange,
  onTricksChange,
}: Props) => (
  <PlayerRoundStyled>
    <PlayerRaw>
      <PlayerBid>
        <UnstyledInput
          aria-label="Bid"
          onChange={event => onBidChange(parseInput(event.target.value))}
          value={bid ?? ''}
          type="number"
          inputMode="numeric"
        />
      </PlayerBid>
      <PlayerGot>
        <UnstyledInput
          aria-label="Tricks won"
          onChange={event => onTricksChange(parseInput(event.target.value))}
          value={tricks ?? ''}
          type="number"
          inputMode="numeric"
        />
      </PlayerGot>
    </PlayerRaw>
    <PlayerTotal>
      <div>{runningScore ?? ''}</div>
    </PlayerTotal>
  </PlayerRoundStyled>
)
