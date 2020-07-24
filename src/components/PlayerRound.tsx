import React, { useState, useEffect } from 'react'
import { BidBox, GotBox, ScoreBox } from './PlayerRound.styles'
import ContentEditable from 'react-contenteditable'

interface Props {
  playerIndex: number
  roundNumber: number
  runningScore: number | null
  onScoreChange: (score: number | null) => void
}

const parseInput = (input: string): number | null => {
  const parsed = parseInt(input, 10)
  return isNaN(parsed) ? null : parsed
}

export const PlayerRound = (props: Props) => {
  const { playerIndex, roundNumber, runningScore, onScoreChange } = props
  const [bid, updateBid] = useState<null | number>(null)
  const [got, updateGot] = useState<null | number>(null)
  const [score, updateScore] = useState<null | number>(null)

  useEffect(() => {
    if (bid === null || got === null) {
      if (score !== null) {
        updateScore(null)
        onScoreChange(null)
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
    <>
      <BidBox playerIndex={playerIndex} roundNumber={roundNumber}>
        <ContentEditable
          onChange={(event: any) => updateBid(parseInput(event.target.value))}
          html={bid?.toString() ?? ''}
        />
      </BidBox>
      <GotBox playerIndex={playerIndex} roundNumber={roundNumber}>
        <ContentEditable
          onChange={(event: any) => updateGot(parseInput(event.target.value))}
          html={got?.toString() ?? ''}
        />
      </GotBox>
      <ScoreBox playerIndex={playerIndex} roundNumber={roundNumber}>
        {score !== null && runningScore !== null ? score + runningScore : ''}
      </ScoreBox>
    </>
  )
}
