import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'
const KEY = 'whist.theme'

const systemTheme = (): Theme =>
  typeof matchMedia === 'function' &&
  matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'

const storedTheme = (): Theme | null => {
  try {
    const value = localStorage.getItem(KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(
    () => storedTheme() ?? systemTheme(),
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const toggle = useCallback(() => {
    setTheme(current => {
      const next = current === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(KEY, next)
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  return [theme, toggle] as const
}
