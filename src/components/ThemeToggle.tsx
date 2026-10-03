import { Moon, Sun } from 'lucide-react'
import { IconButton } from './IconButton'
import type { Theme } from '../hooks/useTheme'

interface Props {
  theme: Theme
  onToggle: () => void
}

export const ThemeToggle = ({ theme, onToggle }: Props) => (
  <IconButton
    label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    onClick={onToggle}
  >
    {theme === 'dark' ? (
      <Sun size={22} aria-hidden="true" />
    ) : (
      <Moon size={22} aria-hidden="true" />
    )}
  </IconButton>
)
