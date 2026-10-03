import {
  Check,
  ChevronLeft,
  ChevronRight,
  Crown,
  Table2,
  X,
} from 'lucide-react'
import { useState, type Dispatch } from 'react'
import { Button } from '../components/Button'
import { IconButton } from '../components/IconButton'
import { Stepper } from '../components/Stepper'
import { ThemeToggle } from '../components/ThemeToggle'
import { TopBar } from '../components/TopBar'
import {
  ROUND_COUNT,
  isRoundComplete,
  roundIssues,
  roundScores,
  runningTotals,
  totals,
  type Game,
  type GameAction,
} from '../game'
import type { Theme } from '../hooks/useTheme'
import styles from './Round.module.css'

interface Props {
  game: Game
  dispatch: Dispatch<GameAction>
  theme: Theme
  onToggleTheme: () => void
  onShowHistory: () => void
}

const sum = (values: (number | null)[]) =>
  values.reduce<number>((acc, v) => acc + (v ?? 0), 0)

const signed = (n: number) => (n > 0 ? `+${n}` : `${n}`)

export const Round = ({
  game,
  dispatch,
  theme,
  onToggleTheme,
  onShowHistory,
}: Props) => {
  // The round on screen: `null` means the current one, a number means an
  // earlier round being revisited to fix a mistake.
  const [viewing, setViewing] = useState<number | null>(null)
  const roundIndex =
    viewing === null ? game.currentRound : Math.min(viewing, game.currentRound)
  const view = (index: number) =>
    setViewing(index >= game.currentRound ? null : index)
  const round = game.rounds[roundIndex]
  const scores = roundScores(round)
  const running = runningTotals(game)
  const before =
    roundIndex === 0 ? game.players.map(() => 0) : running[roundIndex - 1]
  const overall = totals(game)
  const leaderTotal = Math.max(...overall)
  const anyProgress = game.rounds.some(r => r.bids.some(b => b !== null))
  const issues = roundIssues(round)
  const complete = isRoundComplete(round)
  const bidsEntered = round.bids.filter(b => b !== null).length
  const tricksEntered = round.tricks.filter(t => t !== null).length
  const tricksTotal = sum(round.tricks)
  const tricksMismatch = issues.some(i => i.kind === 'tricks-total')
  const isLast = roundIndex === ROUND_COUNT - 1
  const isCurrent = roundIndex === game.currentRound

  const advance = () => {
    if (!isCurrent) setViewing(null)
    else if (isLast) dispatch({ type: 'finishGame' })
    else dispatch({ type: 'completeRound' })
  }

  return (
    <>
      <TopBar
        start={
          <IconButton
            label="View previous round"
            disabled={roundIndex === 0}
            onClick={() => view(roundIndex - 1)}
          >
            <ChevronLeft size={24} aria-hidden="true" />
          </IconButton>
        }
        title={`Round ${roundIndex + 1} of ${ROUND_COUNT}`}
        subtitle={`${round.cards} ${round.cards === 1 ? 'card' : 'cards'}${
          isCurrent ? '' : ' · editing earlier round'
        }`}
        end={
          <>
            <IconButton
              label="View next round"
              disabled={isCurrent}
              onClick={() => view(roundIndex + 1)}
            >
              <ChevronRight size={24} aria-hidden="true" />
            </IconButton>
            <IconButton label="Scoreboard" onClick={onShowHistory}>
              <Table2 size={22} aria-hidden="true" />
            </IconButton>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </>
        }
      />

      <main className={styles.main}>
        <ul className={styles.players}>
          {game.players.map((player, idx) => {
            const score = scores[idx]
            const total =
              before[idx] === null ? null : before[idx] + (score ?? 0)
            const leader =
              anyProgress && overall[idx] === leaderTotal && overall[idx] > 0
            return (
              <li
                key={player.id}
                className={[
                  styles.card,
                  score !== null && (score > 0 ? styles.made : styles.missed),
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className={styles.cardHeader}>
                  <h2 className={styles.name}>
                    {leader && (
                      <Crown
                        size={18}
                        className={styles.crown}
                        aria-label="Leading"
                      />
                    )}
                    {player.name}
                  </h2>
                  <div className={styles.totals}>
                    {score !== null && (
                      <span className={styles.result}>
                        {score > 0 ? (
                          <Check size={16} aria-label="Made" />
                        ) : (
                          <X size={16} aria-label="Missed" />
                        )}
                        {signed(score)}
                      </span>
                    )}
                    <span className={styles.total} aria-label="Total">
                      {total ?? '–'}
                    </span>
                  </div>
                </div>
                <div className={styles.steppers}>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Bid</span>
                    <Stepper
                      label={`${player.name} bid`}
                      value={round.bids[idx]}
                      max={round.cards}
                      invalid={issues.some(
                        i => i.kind === 'bid-out-of-range' && i.player === idx,
                      )}
                      onChange={bid =>
                        dispatch({
                          type: 'setBid',
                          round: roundIndex,
                          player: idx,
                          bid,
                        })
                      }
                    />
                  </div>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Won</span>
                    <Stepper
                      label={`${player.name} tricks won`}
                      value={round.tricks[idx]}
                      max={round.cards}
                      invalid={issues.some(
                        i =>
                          i.kind === 'tricks-out-of-range' && i.player === idx,
                      )}
                      onChange={tricks =>
                        dispatch({
                          type: 'setTricks',
                          round: roundIndex,
                          player: idx,
                          tricks,
                        })
                      }
                    />
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </main>

      <footer className={styles.footer}>
        <div className={styles.summary} aria-live="polite">
          <span>
            Bids <strong>{sum(round.bids)}</strong>
            <span className={styles.muted}>
              {' '}
              / {round.cards} · {bidsEntered}/{game.players.length} in
            </span>
          </span>
          <span className={tricksMismatch ? styles.warn : undefined}>
            Won <strong>{tricksTotal}</strong>
            <span className={styles.muted}>
              {' '}
              / {round.cards}
              {tricksEntered < game.players.length &&
                ` · ${tricksEntered}/${game.players.length} in`}
            </span>
            {tricksMismatch && ' – doesn’t add up'}
          </span>
        </div>
        <Button block disabled={isCurrent && !complete} onClick={advance}>
          {!isCurrent
            ? 'Back to current round'
            : isLast
              ? 'Finish game'
              : 'Next round'}
        </Button>
      </footer>
    </>
  )
}
