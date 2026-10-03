import { ArrowDown, ArrowUp, Plus, X } from 'lucide-react'
import type { Dispatch } from 'react'
import { Button } from '../components/Button'
import { IconButton } from '../components/IconButton'
import { ThemeToggle } from '../components/ThemeToggle'
import { TopBar } from '../components/TopBar'
import { MAX_PLAYERS, MIN_PLAYERS, type Game, type GameAction } from '../game'
import type { Theme } from '../hooks/useTheme'
import styles from './Setup.module.css'

interface Props {
  game: Game
  dispatch: Dispatch<GameAction>
  theme: Theme
  onToggleTheme: () => void
}

export const Setup = ({ game, dispatch, theme, onToggleTheme }: Props) => {
  const { players } = game
  return (
    <>
      <TopBar
        title="Whist"
        subtitle={`${players.length} players · 13 rounds`}
        end={<ThemeToggle theme={theme} onToggle={onToggleTheme} />}
      />
      <main className={styles.main}>
        <h2 className={styles.heading}>Players</h2>
        <ol className={styles.list}>
          {players.map((player, idx) => (
            <li key={player.id} className={styles.row}>
              <span className={styles.index} aria-hidden="true">
                {idx + 1}
              </span>
              <input
                className={styles.name}
                aria-label={`Player ${idx + 1} name`}
                value={player.name}
                maxLength={20}
                autoComplete="off"
                enterKeyHint="done"
                onChange={event =>
                  dispatch({
                    type: 'renamePlayer',
                    player: idx,
                    name: event.target.value,
                  })
                }
                onBlur={event => {
                  if (!event.target.value.trim())
                    dispatch({
                      type: 'renamePlayer',
                      player: idx,
                      name: `Player ${idx + 1}`,
                    })
                }}
              />
              <IconButton
                label={`Move ${player.name} up`}
                disabled={idx === 0}
                onClick={() =>
                  dispatch({ type: 'movePlayer', from: idx, to: idx - 1 })
                }
              >
                <ArrowUp size={20} aria-hidden="true" />
              </IconButton>
              <IconButton
                label={`Move ${player.name} down`}
                disabled={idx === players.length - 1}
                onClick={() =>
                  dispatch({ type: 'movePlayer', from: idx, to: idx + 1 })
                }
              >
                <ArrowDown size={20} aria-hidden="true" />
              </IconButton>
              <IconButton
                label={`Remove ${player.name}`}
                disabled={players.length <= MIN_PLAYERS}
                onClick={() => dispatch({ type: 'removePlayer', player: idx })}
              >
                <X size={20} aria-hidden="true" />
              </IconButton>
            </li>
          ))}
        </ol>
        <Button
          variant="secondary"
          block
          disabled={players.length >= MAX_PLAYERS}
          onClick={() => dispatch({ type: 'addPlayer' })}
        >
          <Plus size={20} aria-hidden="true" />
          Add player
        </Button>
        <p className={styles.hint}>
          {players.length >= MAX_PLAYERS
            ? `Up to ${MAX_PLAYERS} players.`
            : 'Enter players in seating order.'}
        </p>
      </main>
      <footer className={styles.footer}>
        <Button block onClick={() => dispatch({ type: 'startGame' })}>
          Start game
        </Button>
      </footer>
    </>
  )
}
