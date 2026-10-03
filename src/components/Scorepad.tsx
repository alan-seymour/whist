import { useState, type Dispatch } from 'react'
import { PlayerNames } from './PlayerNames'
import { PlayerRows } from './PlayerRows'
import {
  Wrapper,
  ScoreWrapper,
  Scores,
  SideBarWrapper,
  NextRound,
  RoundButton,
} from './Scorepad.styles'
import { CardRow } from './CardRow'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import {
  ROUND_COUNT,
  loadGame,
  useGame,
  type Game,
  type GameAction,
} from '../game'
import { ResumePrompt } from './ResumePrompt'

const ScorepadView = ({
  game,
  dispatch,
}: {
  game: Game
  dispatch: Dispatch<GameAction>
}) => {
  const visibleRounds = game.currentRound + 1
  return (
    <Wrapper>
      <SideBarWrapper>
        <NextRound>
          <RoundButton
            type="button"
            aria-label="Previous round"
            disabled={game.currentRound === 0}
            onClick={() =>
              dispatch({ type: 'goToRound', round: game.currentRound - 1 })
            }
          >
            <FiArrowLeft />
          </RoundButton>
          <RoundButton
            type="button"
            aria-label="Next round"
            disabled={game.currentRound >= ROUND_COUNT - 1}
            onClick={() => dispatch({ type: 'completeRound' })}
          >
            <FiArrowRight />
          </RoundButton>
        </NextRound>
        <PlayerNames players={game.players} dispatch={dispatch} />
      </SideBarWrapper>
      <ScoreWrapper>
        <Scores>
          <CardRow visibleRounds={visibleRounds} />
          <PlayerRows
            game={game}
            visibleRounds={visibleRounds}
            dispatch={dispatch}
          />
        </Scores>
      </ScoreWrapper>
    </Wrapper>
  )
}

const Loaded = ({ initial }: { initial: Game | null }) => {
  const [game, dispatch] = useGame(initial)
  return <ScorepadView game={game} dispatch={dispatch} />
}

export const Scorepad = () => {
  const [saved] = useState(loadGame)
  const [choice, setChoice] = useState<'resume' | 'new' | null>(null)

  if (saved && choice === null) {
    return (
      <ResumePrompt
        onResume={() => setChoice('resume')}
        onNewGame={() => setChoice('new')}
      />
    )
  }
  return <Loaded initial={choice === 'resume' ? saved : null} />
}
