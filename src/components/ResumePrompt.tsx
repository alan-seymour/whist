import { Button } from './Button'
import styles from './ResumePrompt.module.css'

interface Props {
  onResume: () => void
  onNewGame: () => void
}

export const ResumePrompt = ({ onResume, onNewGame }: Props) => (
  <main className={styles.prompt} role="dialog" aria-labelledby="resume-title">
    <h1 id="resume-title" className={styles.title}>
      Resume saved game?
    </h1>
    <p className={styles.text}>There's a game in progress on this device.</p>
    <Button block onClick={onResume} autoFocus>
      Resume
    </Button>
    <Button block variant="secondary" onClick={onNewGame}>
      New game
    </Button>
  </main>
)
