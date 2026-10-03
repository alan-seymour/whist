import { Trophy } from 'lucide-react'
import type { Dispatch } from 'react'
import { Button } from '../components/Button'
import { ThemeToggle } from '../components/ThemeToggle'
import { TopBar } from '../components/TopBar'
import { roundScores, standings, type Game, type GameAction } from '../game'
import type { Theme } from '../hooks/useTheme'
import styles from './GameOver.module.css'

interface Props {
  game: Game
  dispatch: Dispatch<GameAction>
  theme: Theme
  onToggleTheme: () => void
  onShowHistory: () => void
}

export const GameOver = ({
  game,
  dispatch,
  theme,
  onToggleTheme,
  onShowHistory,
}: Props) => {
  const ranked = standings(game)
  const made = game.players.map(
    (_, p) =>
      game.rounds.filter(round => (roundScores(round)[p] ?? 0) > 0).length,
  )
  return (
    <>
      <TopBar
        title="Game over"
        end={<ThemeToggle theme={theme} onToggle={onToggleTheme} />}
      />
      <main className={styles.main}>
        <ol className={styles.list}>
          {ranked.map(({ player, total, rank }) => (
            <li
              key={game.players[player].id}
              className={[styles.row, rank === 1 && styles.winner]
                .filter(Boolean)
                .join(' ')}
            >
              <span className={styles.rank}>
                {rank === 1 ? <Trophy size={22} aria-label="Winner" /> : rank}
              </span>
              <span className={styles.name}>
                {game.players[player].name}
                <span className={styles.stat}>
                  made {made[player]} of {game.rounds.length}
                </span>
              </span>
              <span className={styles.total}>{total}</span>
            </li>
          ))}
        </ol>
        <div className={styles.actions}>
          <Button
            block
            onClick={() => dispatch({ type: 'newGame', players: game.players })}
          >
            Play again
          </Button>
          <Button block variant="secondary" onClick={onShowHistory}>
            View scoreboard
          </Button>
          <Button
            block
            variant="ghost"
            onClick={() => dispatch({ type: 'newGame' })}
          >
            New game with new players
          </Button>
        </div>
      </main>
    </>
  )
}
