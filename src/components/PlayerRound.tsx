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
  onScoreChange: (score: number | null) => void
  score: number | null
}

const parseInput = (input: string): number | null => {
  const parsed = parseInt(input, 10)
  return isNaN(parsed) ? 0 : parsed
}

export const PlayerRound = (props: Props) => {
  const { runningScore, score, onScoreChange } = props
  const [bid, updateBid] = useState<null | number>(null)
  const [got, updateGot] = useState<null | number>(null)

  useEffect(() => {
    let newScore: number | null = null
    if (bid === null || got === null) {
      newScore = null
    } else if (bid !== got) {
      const diff = Math.abs(bid - got)
      newScore = 0 - 5 - diff
    } else if (bid === got) {
      newScore = 5 + bid
    }
    if (newScore !== score) {
      onScoreChange(newScore)
    }
  }, [bid, got, score, runningScore, onScoreChange])
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
            type="number"
          />
        </PlayerGot>
      </PlayerRaw>
      <PlayerTotal>
        <div>{score !== null && runningScore !== null ? runningScore : ''}</div>
      </PlayerTotal>
    </PlayerRoundStyled>
  )
}
