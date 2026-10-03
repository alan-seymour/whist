import { ArrowLeft, Check, X } from 'lucide-react'
import { IconButton } from '../components/IconButton'
import { ThemeToggle } from '../components/ThemeToggle'
import { TopBar } from '../components/TopBar'
import { roundScores, standings, totals, type Game } from '../game'
import type { Theme } from '../hooks/useTheme'
import styles from './History.module.css'

interface Props {
  game: Game
  theme: Theme
  onToggleTheme: () => void
  onBack: () => void
}

export const History = ({ game, theme, onToggleTheme, onBack }: Props) => {
  const rounds = game.rounds.slice(0, game.currentRound + 1)
  const scores = rounds.map(roundScores)
  const overall = totals(game)
  const ranks = new Map(standings(game).map(s => [s.player, s.rank]))

  return (
    <>
      <TopBar
        start={
          <IconButton label="Back to round" onClick={onBack}>
            <ArrowLeft size={24} aria-hidden="true" />
          </IconButton>
        }
        title="Scoreboard"
        end={<ThemeToggle theme={theme} onToggle={onToggleTheme} />}
      />
      <main className={styles.main}>
        <div className={styles.scroller}>
          <table className={styles.table}>
            <caption className="visually-hidden">
              Scores by round. Each cell shows bid, tricks won and points.
            </caption>
            <thead>
              <tr>
                <th scope="col" className={styles.nameHead}>
                  Player
                </th>
                {rounds.map((round, idx) => (
                  <th scope="col" key={idx} className={styles.roundHead}>
                    <span className={styles.roundNo}>R{idx + 1}</span>
                    <span className={styles.cards}>{round.cards}</span>
                  </th>
                ))}
                <th scope="col" className={styles.totalHead}>
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {game.players.map((player, p) => (
                <tr key={player.id}>
                  <th scope="row" className={styles.nameCell}>
                    <span className={styles.rank}>{ranks.get(p)}</span>
                    {player.name}
                  </th>
                  {rounds.map((round, r) => {
                    const score = scores[r][p]
                    const bid = round.bids[p]
                    const won = round.tricks[p]
                    return (
                      <td
                        key={r}
                        className={[
                          styles.cell,
                          score !== null &&
                            (score > 0 ? styles.made : styles.missed),
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {score === null ? (
                          <span className={styles.pending}>
                            {bid ?? '–'}/{won ?? '–'}
                          </span>
                        ) : (
                          <>
                            <span className={styles.points}>
                              {score > 0 ? (
                                <Check size={12} aria-label="Made" />
                              ) : (
                                <X size={12} aria-label="Missed" />
                              )}
                              {score > 0 ? `+${score}` : score}
                            </span>
                            <span className={styles.detail}>
                              {bid}/{won}
                            </span>
                          </>
                        )}
                      </td>
                    )
                  })}
                  <td className={styles.totalCell}>{overall[p]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  )
}
