import React, { useState, useEffect } from 'react'
import {
  PlayerRoundStyled,
  PlayerRaw,
  PlayerBid,
  PlayerGot,
  PlayerTotal,
  UnstyledInput,
} from './PlayerRound.styles'

interface Props {
  runningScore: number | null
  onScoreChange: (score: number) => void
}

const parseInput = (input: string): number | null => {
  const parsed = parseInt(input, 10)
  return isNaN(parsed) ? 0 : parsed
}

export const PlayerRound = (props: Props) => {
  const { runningScore, onScoreChange } = props
  const [bid, updateBid] = useState<null | number>(null)
  const [got, updateGot] = useState<null | number>(null)
  const [score, updateScore] = useState<null | number>(null)

  useEffect(() => {
    if (bid === null || got === null) {
      if (score !== null) {
        updateScore(null)
      }
    } else if (bid !== got) {
      const diff = Math.abs(bid - got)
      updateScore(0 - 5 - diff)
      onScoreChange(0 - 5 - diff)
    } else if (bid === got) {
      updateScore(5 + bid)
      onScoreChange(5 + bid)
    }
  }, [bid, got, score, runningScore])
  return (
    <PlayerRoundStyled>
      <PlayerRaw>
        <PlayerBid>
          <UnstyledInput
            onChange={(event: any) => updateBid(parseInput(event.target.value))}
            value={bid?.toString() ?? ''}
            type="number"
          />
        </PlayerBid>
        <PlayerGot>
          <UnstyledInput
            onChange={(event: any) => updateGot(parseInput(event.target.value))}
            value={got?.toString() ?? ''}
          />
        </PlayerGot>
      </PlayerRaw>
      <PlayerTotal>
        <div>
          {score !== null && runningScore !== null ? score + runningScore : ''}
        </div>
      </PlayerTotal>
    </PlayerRoundStyled>
  )
}
