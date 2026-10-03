import { useState } from 'react'
import { ResumePrompt } from './components/ResumePrompt'
import { hasProgress, loadGame, useGame, type Game } from './game'
import { useTheme } from './hooks/useTheme'
import { useWakeLock } from './hooks/useWakeLock'
import { GameOver } from './screens/GameOver'
import { History } from './screens/History'
import { Round } from './screens/Round'
import { Setup } from './screens/Setup'

const Screens = ({ initial }: { initial: Game | null }) => {
  const [game, dispatch] = useGame(initial)
  const [theme, toggleTheme] = useTheme()
  const [showHistory, setShowHistory] = useState(false)
  useWakeLock(game.status === 'playing')

  const common = { game, dispatch, theme, onToggleTheme: toggleTheme }

  if (game.status === 'setup') return <Setup {...common} />
  if (showHistory)
    return <History {...common} onBack={() => setShowHistory(false)} />
  if (game.status === 'finished')
    return <GameOver {...common} onShowHistory={() => setShowHistory(true)} />
  return <Round {...common} onShowHistory={() => setShowHistory(true)} />
}

function App() {
  const [saved] = useState(loadGame)
  const [choice, setChoice] = useState<'resume' | 'new' | null>(null)

  if (saved && hasProgress(saved) && choice === null) {
    return (
      <ResumePrompt
        onResume={() => setChoice('resume')}
        onNewGame={() => setChoice('new')}
      />
    )
  }
  return <Screens initial={choice === 'new' ? null : saved} />
}

export default App
