import React, { useState } from 'react'
import { PlayerNames } from './PlayerNames'
import { PlayerRows } from './PlayerRows'
import {
  Wrapper,
  ScoreWrapper,
  Scores,
  SideBarWrapper,
  NextRound,
} from './Scorepad.styles'
import { CardRow } from './CardRow'
import { FiArrowRight } from 'react-icons/fi'

export const Scorepad = () => {
  const [playerCount, updatePlayerCount] = useState(4)
  const [visibleRounds, updateVisibleRounds] = useState(3)

  return (
    <Wrapper>
      <SideBarWrapper>
        <NextRound>
          {visibleRounds < 13 && (
            <FiArrowRight
              onClick={() =>
                updateVisibleRounds(Math.min(visibleRounds + 1, 13))
              }
            />
          )}
        </NextRound>

        <PlayerNames
          playerCount={playerCount}
          updatePlayerCount={(count: number) => updatePlayerCount(count)}
        />
      </SideBarWrapper>
      <ScoreWrapper>
        <Scores>
          <CardRow visibleRounds={visibleRounds} />
          <PlayerRows visibleRounds={visibleRounds} playerCount={playerCount} />
        </Scores>
      </ScoreWrapper>
    </Wrapper>
  )
}
