import { useEffect, useReducer } from 'react'
import { createGame, gameReducer } from './reducer'
import { saveGame } from './persistence'
import type { Game } from './types'

export const useGame = (initial?: Game | null) => {
  const [game, dispatch] = useReducer(
    gameReducer,
    initial ?? undefined,
    saved => saved ?? createGame(),
  )
  useEffect(() => {
    saveGame(game)
  }, [game])
  return [game, dispatch] as const
}
